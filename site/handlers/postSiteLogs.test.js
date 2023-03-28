'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {now} from "../../common/utils.mjs";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test('add logs to db', async () => {
    const addSiteLogs = jest.fn()

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addSiteLogs
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const logs = [
        {loggedAt: now(), content: "log1"},
        {loggedAt: now()+1, content: "log2"},
    ]
    const userSiteId = new ObjectId()
    const userId = new ObjectId()
    const response = await supertest(app)
        .post(`/v1/site/${userSiteId}/logs`)
        .set({id: `${userId}`})
        .send(logs)
    simpleCheckTKResponse(response, TKResponse.Success())
    expect(addSiteLogs).toHaveBeenCalledWith(`${userId}`, `${userSiteId}`, logs)
})