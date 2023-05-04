'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";

test("register should be ok", async () => {
    const encodePassword = jest.fn(async () => {
        return "encodedPassword"
    })
    const userId = new ObjectId()
    const addBackendUser = jest.fn(async () => {
        return userId
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
                        addBackendUser,
                    },
                    password: {
                        encode: encodePassword
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
        .post('/v1/backend/register')
        .send({username: "abc", password: "bodyPassword"})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            accessToken: "accessToken",
            refreshToken: "refreshToken"
        }
    }))
    expect(encodePassword).toHaveBeenCalledWith("bodyPassword")
    expect(addBackendUser).toHaveBeenCalledWith({username: "abc", password: "encodedPassword"})
    expect(getToken).toHaveBeenCalledWith({id: `${userId}`})
})