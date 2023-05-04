'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";

test("return from db", async () => {
    const getSiteLogs = jest.fn(async () => {
        return [
            {loggedAt: now(), content: "log2"},
            {loggedAt: now() + 1, content: "log1"},
        ]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getSiteLogs
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userSiteId = new ObjectId()
    const userId = new ObjectId()
    const response = await supertest(app)
        .get(`/v1/site/${userSiteId}/logs`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: [
            {loggedAt: now(), content: "log2"},
            {loggedAt: now()+1, content: "log1"},
        ]
    }))
    expect(getSiteLogs).toHaveBeenCalledWith(`${userId}`, `${userSiteId}`)
})
