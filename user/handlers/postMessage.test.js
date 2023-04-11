'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("add msg", async () => {
    const msgId = new ObjectId()
    const addMessage = jest.fn(async () => {
        return msgId
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addMessage
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .post('/v1/user/message')
        .send({
            msg: "message body",
            userId: userId.toString()
        })

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {id: msgId.toString()}
    }))
    expect(addMessage).toHaveBeenCalledWith({
        msg: "message body",
        userId: userId,
    })
})