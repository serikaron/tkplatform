"use restrict"

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("read message", async () => {
    const updateMessage = jest.fn()

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        updateMessage
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const messageId = new ObjectId()
    const userId = new ObjectId()
    const response = await supertest(app)
        .put(`/v1/user/message/${messageId}`)
        .send({read: true})
        .set({id: userId.toString()})

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(updateMessage).toHaveBeenCalledWith(messageId.toString(), userId.toString(), {read: true})
})