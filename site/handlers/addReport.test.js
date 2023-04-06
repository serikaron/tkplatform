"use restrict"

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test('update db correctly', async () => {
    const addReport = jest.fn()

    const app = createApp()
    setup(app,{
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addReport
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
        .post(`/v1/user/site/${userSiteId}/report`)
        .set({id: `${userId}`})
        .send({msg: "report content"})

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(addReport).toHaveBeenCalledWith(`${userId}`, `${userSiteId}`, {msg: "report content"})
})