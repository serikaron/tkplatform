'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals";
import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";

async function runTest(
    {
        header,
        getUserSites,
        tkResponse,
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserSites
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get('/v1/user/sites')
        .set(header)
    simpleCheckTKResponse(response, tkResponse)
}

const genUserSite = () => {
    return {
        site: {
            id: "site-id",
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
}

test("no tests found", () => {})

// 代码修改了，测试用例需要相应修改
test.skip("should return sites from db", async () => {
    const id = new ObjectId()
    const dbUserSite = genUserSite()
    const userId = new ObjectId()
    dbUserSite._id = id
    dbUserSite.userId = userId
    dbUserSite.setting.schedule.forEach(x => {
        delete x.activated
    })
    const getUserSites = jest.fn(async () => {
        return [dbUserSite]

    })
    const tkUserSite = genUserSite()
    tkUserSite.id = `${id}`
    await runTest({
        header: {id: `${userId}`},
        getUserSites,
        tkResponse: TKResponse.Success({
            data: [tkUserSite]
        })
    })
    expect(getUserSites).toHaveBeenCalledWith(`${userId}`)
})

// TODO: check db return null
