'use restrict'


import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("should return member expiration from db", async () => {
    const getUserById = jest.fn(async () => {
        return {
            member: { expiration: 1234567 }
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
        .get("/v1/user/member")
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, TKResponse.Success({
        data: {expiration: 1234567}
    }))
    expect(getUserById).toHaveBeenCalledWith("a fake user id")
})