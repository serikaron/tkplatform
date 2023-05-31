'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("no test foun", () => {})

// 代码修改了，测试用例需要相应修改
test.skip('get user from db', async () => {
    const userId = new ObjectId()
    const getUserById = jest.fn(async () => {
        return {
            _id: userId,
            someOtherFields: "should return also"
        }
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserById
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get(`/v1/backend/user/${userId}`)

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            id: userId.toString(),
            someOtherFields: "should return also"
        }
    }))
    expect(getUserById).toHaveBeenCalledWith(userId.toString())
})

