'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";

test("login flow should ok", async () => {
    const userId = new ObjectId()
    const getUser = jest.fn(async () => {
        return {
            _id: userId,
            password: "serverPassword"
        }
    })
    const checkPassword = jest.fn(async () => {
        return true
    })
    const getToken = jest.fn(async () => {
        return TKResponse.Success({
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            }
        })
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getBackendUser: getUser
                    },
                    password: {
                        verify: checkPassword
                    },
                    stubs: {
                        token: {
                            gen: getToken
                        }
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/backend/login")
        .send({username: "abc", password: "bodyPassword"})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            accessToken: "accessToken",
            refreshToken: "refreshToken"
        }
    }))
    expect(getUser).toHaveBeenCalledWith("abc")
    expect(checkPassword).toHaveBeenCalledWith("serverPassword", "bodyPassword")
    expect(getToken).toHaveBeenCalledWith({id: `${userId}`})
})