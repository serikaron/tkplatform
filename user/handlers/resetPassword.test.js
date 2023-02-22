'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from '@jest/globals'
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const defaultBody = {
    smsCode: "1234", newPassword: "123456", phone: "13333333333"
}

const defaultGetFn = async () => {
    return {
        _id: "f82a5acf-8860-4cec-b0c5-9650afeaccef",
        phone: "13333333333",
    }
}

const defaultSmsFn = async () => {
    return TKResponse.Success()
}

async function runTest(
    {
        body = defaultBody,
        getFn = defaultGetFn,
        smsFn = defaultSmsFn,
        setFn = async () => {},
        encodeFn = async () => {
            return "encodedNewPassword"
        },
        tokenFn = async () => { return TKResponse.Success({data: defaultResponseData})},
        status, code, msg, data = {}
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserByPhone: getFn,
                        updatePassword: setFn
                    },
                    stubs: {
                        sms: {
                            verify: smsFn
                        },
                        token: {
                            gen: tokenFn
                        }
                    },
                    password: {
                        encode: encodeFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/password")
        .send(body)
    simpleCheckResponse(response, status, code, msg, data)
}

test.concurrent.each([
    {smsCode: "1234", phone: "13333333333"},
    {newPassword: "123456", phone: "13333333333"},
    {smsCode: "1234", newPassword: "123456"},
    {phone: "1222", smsCode: "1234", newPassword: "123456"}
])("invalid body ($#) should return InvalidArgument", async (body) => {
    await runTest({
        body,
        status: 400, code: -1, msg: "参数错误"
    })
})

test.concurrent.each([
    {
        getFn: jest.fn(async () => {
            return null
        }),
        status: 404, code: -10002, msg: "用户不存在"
    },
])("user check failed ($#) should return failed", async ({getFn, status, code, msg}) => {
    await runTest({
        getFn, status, code, msg
    })
    expect(getFn).toHaveBeenCalledWith({phone: "13333333333"}, {_id: 1})
})

test("sms code check failed should return InvalidArgument", async () => {
    const smsFn = jest.fn(async () => {
        return TKResponse.fromError(new InvalidArgument())
    })
    await runTest({
        smsFn,
        status: 400, code: -10006, msg: "验证码错误"
    })
    expect(smsFn).toHaveBeenCalledWith("13333333333", "1234")
})

test("password should be encoded and save to db", async () => {
    const updatePassword = jest.fn()
    const encodeFn = jest.fn(async () => {
        return "encodedPassword"
    })
    await runTest({
        setFn: updatePassword,
        encodeFn,
        status: 200, code: 0, msg: "更新成功"
    })
    expect(updatePassword).toHaveBeenCalledWith("13333333333", "encodedPassword")
    expect(encodeFn).toHaveBeenCalledWith("123456")
})

// no token
// test.concurrent.each([
//     {
//         tokenResponse: TKResponse.fromError(new InternalError()),
//         status: 200, code: 0, msg: "更新成功，请重新登录", data: {}
//     },
//     {
//         tokenResponse: TKResponse.Success({data: defaultResponseData}),
//         status: 200, code: 0, msg: "更新成功", data: defaultResponseData
//     }
// ]) ("($#) should check response", async ({tokenResponse, status, code, msg, data}) => {
//     const tokenFn = jest.fn(async () => {
//         return tokenResponse
//     })
//     await runTest({
//         tokenFn, status, code, msg, data
//     })
//     expect(tokenFn).toHaveBeenCalledWith({id: defaultHeaders.id, phone: defaultHeaders.phone})
// })