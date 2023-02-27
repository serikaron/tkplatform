"use restrict"

import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {TKResponse} from "../../common/TKResponse.mjs";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {setup} from "../setup.mjs";
import {jest} from "@jest/globals";
import {InvalidArgument, NotFound} from "../../common/errors/00000-basic.mjs";
import {ObjectId} from "mongodb";

async function runTest(
    {
        body,
        updateFn,
        getSite,
        userId = new ObjectId(),
        tkResponse
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addUserSite: updateFn,
                        getSite,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/site")
        .set({id: `${userId}`})
        .send(body)
    simpleCheckResponse(response, tkResponse.status, tkResponse.code, tkResponse.msg, tkResponse.data)
}

describe.each([
    {
        body: {},
    },
    {
        body: {siteId: 12345}
    },
    {
        body: {siteId: "invalid object id"}
    }
])("($#) invalid body", ({body}) => {
    test.concurrent("should return InvalidArgument", async () => {
        await runTest({
            body,
            tkResponse: TKResponse.fromError(new InvalidArgument())
        })
    })
})

test("system site not found should return 404", async () => {
    const getSite = jest.fn(async () => {
        return null
    })
    await runTest({
        body: {siteId: "63f8361d20edd1ae951230fd"},
        getSite,
        tkResponse: TKResponse.fromError(new NotFound({msg: "站点不存在"}))
    })
    expect(getSite).toHaveBeenCalledWith(new ObjectId("63f8361d20edd1ae951230fd"))
})

test('test add site should work as expect', async () => {
    const siteId = new ObjectId()
    const userId = new ObjectId()
    const userSiteId = new ObjectId()
    const getSite = async (id) => {
        return {
            _id: id,
            name: "a fake site name"
        }
    }
    const addUserSite = jest.fn(async (item) => {
        item._id = userSiteId
        return userSiteId
    })

    const userSite = {
        id: userSiteId,
        site: {
            id: siteId,
            name: "a fake site name"
        },
        "credential": {
            "account": "",
            "password": ""
        },
        "verified": false,
        "account": {
            "list": []
        },
        "setting": {
            "interval": {
                "min": 200,
                "max": 300,
            },
            "schedule": [
                {
                    "from": "",
                    "to": "",
                    activated: false,
                },
                {
                    from: "",
                    to: "",
                    activated: false,
                }
            ]
        }
    }
    const responseBody = JSON.parse(JSON.stringify(userSite))
    responseBody.id = `${userSiteId}`
    responseBody.site.id = `${siteId}`
    delete responseBody.userId
    await runTest({
        body: {siteId},
        updateFn: addUserSite,
        getSite,
        userId,
        tkResponse: TKResponse.Success({
            data: responseBody
        })
    })
    expect(addUserSite).toHaveBeenCalledWith(userSite)
})
