'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {jest} from "@jest/globals";

const runTest = async (
    {
        body,
        tkResponse,
        keepRecord,
        userId, userSiteId, recordId
    }
) => {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        keepRecord
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    console.log(`/v1/site/${userSiteId}/record/${recordId}`)
    const response = await supertest(app)
        .put(`/v1/site/${userSiteId}/record/${recordId}`)
        .send(body)
        .set({id: `${userId}`})
    simpleCheckTKResponse(response, tkResponse)
}

describe.each([
    {body: {}},
    {body: {notSupportedKey: 1}}
])("($#) body", ({body}) => {
    test("should be checked", async () => {
        await runTest({
            body,
            tkResponse: TKResponse.fromError(new InvalidArgument())
        })
    })
})

test("keep record", async () => {
    const keepRecord = jest.fn()
    const userSiteId = new ObjectId()
    const recordId = new ObjectId()
    const userId = new ObjectId()
    await runTest({
        body: {kept: 1},
        tkResponse: TKResponse.Success(),
        keepRecord,
        userSiteId, recordId, userId
    })
    expect(keepRecord).toHaveBeenCalledWith(`${recordId}`, `${userId}`, `${userSiteId}`)
})