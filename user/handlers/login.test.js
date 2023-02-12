'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import supertest from "supertest";
import {Response} from "../../common/response.mjs";

async function runTest(
    {
        body = {phone: "13333333333", password: "123456"},
        dbUsers = {},
        token = undefined,
        status, code, msg, data = {},
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup(makeMiddleware([
            (req) => {
                req.context = {
                    mongo: {
                        getUserByPhone: async (phone) => {
                            return phone in dbUsers ? dbUsers[phone] : null
                        }
                    },
                    stubs: {
                        token: {
                            gen: async (payload) => {
                                if (token === undefined) {
                                    return new Response(500, {code: -1})
                                } else {
                                    return new Response(200, {code: 0, msg: "success", data: token})
                                }
                            }
                        }
                    }
                }
            }
        ])),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/login")
        .send(body)
    if (response.status === 500 && response.body.code === 1) {
        throw new Error(response.body.msg)
    }
    expect(response.status).toBe(status)
    expect(response.body.code).toEqual(code)
    expect(response.body.msg).toEqual(msg)
    expect(response.body.data).toEqual(data)
}

describe("test login", () => {
    test.concurrent.each([
        {phone: "13333333333"},
        {password: "12345"}
    ])("post invalid body ($#) should return InvalidArgument", async (body) => {
        await runTest({
            body,
            status: 400,
            code: -1,
            msg: "参数错误"
        })
    })

    test.concurrent.each([
        {
            name: "user not found",
            body: {phone: "13333333333", password: "12345"}
        },
        {
            name: "invalid password",
            body: {phone: "13333333333", password: "1234"},
            dbUsers: {
                "13333333333": {
                    password: "$argon2id$v=19$m=65536,t=3,p=4$ikege0oHTlgCJU5GoC25Aw$RDpdmkT/gLXP9eohSf2OJb3oWYjMvJ885P35xq8LswA"
                }
            }
        }
    ])("$name should return PasswordNotMatch", async ({name, body, dbUsers}) => {
        await runTest({
            body, dbUsers,
            status: 403,
            code: -10003,
            msg: "用户名或密码错误"
        })
    })

    test("gen token failed should return LoginFailed", async () => {
        await runTest({
            body: {phone: "13333333333", password: "123456"},
            dbUsers: {
                "13333333333": {
                    password: "$argon2id$v=19$m=65536,t=3,p=4$ikege0oHTlgCJU5GoC25Aw$RDpdmkT/gLXP9eohSf2OJb3oWYjMvJ885P35xq8LswA"
                }
            },
            token: undefined,
            status: 500,
            code: -10004,
            msg: "登录失败"
        })
    })

    test("login success should return correct token", async () => {
        await runTest({
            body: {phone: "13333333333", password: "123456"},
            dbUsers: {
                "13333333333": {
                    password: "$argon2id$v=19$m=65536,t=3,p=4$ikege0oHTlgCJU5GoC25Aw$RDpdmkT/gLXP9eohSf2OJb3oWYjMvJ885P35xq8LswA"
                }
            },
            token: {
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            },
            status: 200,
            code: 0,
            msg: "登录成功",
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            }
        })
    })
})