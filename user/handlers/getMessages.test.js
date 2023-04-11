'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {
        name: "normal query",
        query: {offset: 10, limit: 10},
        dbArgs: {offset: 10, limit: 10},
    },
    {
        name: "empty query",
        dbArgs: {offset: 0, limit: 50}
    }
])
("$name", ({query, dbArgs}) => {
    it("get message from db", async () => {
        const msgId = new ObjectId()
        const getMessages = jest.fn(async () => {
            return [{_id: msgId}]
        })
        const countMessages = jest.fn(async () => {
            return 10
        })

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getMessages, countMessages
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const url = query === undefined ? '/v1/user/messages' : `/v1/user/messages?${new URLSearchParams(query)}`
        const userId = new ObjectId()
        const response = await supertest(app)
            .get(url)
            .set({id: userId.toString()})

        simpleCheckTKResponse(response, TKResponse.Success({
            data: {
                total: 10,
                items: [{id: msgId.toString()}]
            }
        }))
        expect(getMessages).toHaveBeenCalledWith(userId.toString(), dbArgs.offset, dbArgs.limit)
        expect(countMessages).toHaveBeenCalledWith(userId.toString())
    })
})