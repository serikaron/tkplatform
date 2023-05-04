'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {setup} from "../server.mjs";

describe.each([
    {
        name: "with params",
        params: {offset: 10, limit: 10},
        dbParams: {offset: 10, limit: 10}
    },
    {
        name: "without params",
        dbParams: {offset: 0, limit: 50}
    },
    {
        name: "with invalid params",
        params: {offset: "abc", limit: "def"},
        dbParams: {offset: 0, limit: 50}
    },
    {
        name: "exceed limitation",
        params: {offset: 10, limit: 100},
        dbParams: {offset: 10, limit: 50}
    }
])
("$name", ({params, dbParams}) => {
    const userId = new ObjectId()
    it("should access db correctly", async () => {
        const getUsers = jest.fn(async () => {
            return [{
                _id: userId,
            }]
        })
        const countUsers = jest.fn(async () => {
            return 100
        })

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getUsers,
                            countUsers
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const adminId = new ObjectId()
        const url = params === undefined ? `/v1/backend/users` : `/v1/backend/users?${new URLSearchParams(params)}`
        const response = await supertest(app)
            .get(url)
            .set({id: adminId.toString()})

        simpleCheckTKResponse(response, TKResponse.Success({
            data: {
                total: 100,
                offset: dbParams.offset,
                limit: dbParams.limit,
                items: [{id: userId.toString()}]
            }
        }))
        expect(getUsers).toHaveBeenCalledWith(dbParams.offset, dbParams.limit)
        expect(countUsers).toHaveBeenCalled()
    })
})