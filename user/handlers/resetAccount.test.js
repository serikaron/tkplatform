'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals"
import {TKResponse} from "../../common/TKResponse.mjs";
import {CodeError} from "../../common/errors/30000-sms-captcha.mjs";
import {InternalError} from "../../common/errors/00000-basic.mjs";

const defaultBody = {
    old: {
        phone: "13333333333",
        password: "1234"
    },
    new: {
        phone: "14444444444",
        password: "2345"
    },
    smsCode: "1234"
}

const defaultHeaders = {
    id: "userId",
    phone: "13333333333",
}

const defaultDbUser = {
    _id: "userId",
    phone: "13333333333",
    password: "encodedOldPassword"
}

const defaultGetFn = async () => {
    return defaultDbUser
}

const defaultVerifyFn = async () => {
    return true
}

const defaultSmsFn = async () => {
    return TKResponse.Success()
}

const defaultResponseData = {
    accessToken: "accessToken",
    refreshToken: "refreshToken"
}

const defaultTokenFn = async () => {
    return TKResponse.Success({
        data: defaultResponseData
    })
}

const defaultEncodeFn = async () => {
    return "encodedNewPassword"
}

async function runTest(
    {
        body = defaultBody,
        headers = defaultHeaders,
        getFn = defaultGetFn,
        verifyFn = defaultVerifyFn,
        encodeFn = defaultEncodeFn,
        smsFn = defaultSmsFn,
        setFn = async () => {
        },
        tokenFn = defaultTokenFn,
        status, code, msg, data = {}
    }) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserById: getFn,
                        updateAccount: setFn,
                    },
                    password: {
                        verify: verifyFn,
                        encode: encodeFn
                    },
                    stubs: {
                        sms: {
                            verify: smsFn
                        },
                        token: {
                            gen: tokenFn,
                        }
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/account")
        .set(headers)
        .send(body)
    simpleCheckResponse(response, status, code, msg, data)
}

test.concurrent.each([
    {
        new: {phone: "14444444444", password: "2345"},
    },
    {
        old: {phone: "13333333333"},
        new: {phone: "14444444444", password: "2345"},
    },
    {
        old: {password: "1234"},
        new: {phone: "14444444444", password: "2345"},
    },
    {
        old: {phone: "13333333333", password: "1234"},
    },
    {
        old: {phone: "13333333333", password: "1234"},
        new: {password: "2345"},
    },
    {
        old: {phone: "13333333333", password: "1234"},
        new: {phone: "14444444444"},
    },
    {
        old: {phone: "13333333333", password: "1234"},
        new: {phone: "1111", password: "2345"},
    },
])("invalid body ($#) should return InvalidPassword", async (body) => {
    await runTest({
        body,
        status: 400, code: -1, msg: "参数错误"
    })
})

test.concurrent.each([
    {
        name: "if phone not match (header vs db)",
        headers: {id: "userId", phone: "13444444444"},
        dbUser: null,
        verifyResult: true,
        body: defaultBody,
    },
    {
        name: "if user not found in db",
        dbUser: null,
        headers: defaultHeaders,
        verifyResult: true,
        body: defaultBody,
    },
    {
        name: "an invalid old password",
        headers: defaultHeaders,
        dbUser: defaultDbUser,
        verifyResult: false,
        body: defaultBody,
    },
])("$name should return bad request", async ({headers, dbUser, verifyResult, body}) => {
    const getUserById = jest.fn(async () => {
        return dbUser
    })
    const verify = jest.fn(async () => {
        return verifyResult
    })
    await runTest({
        headers,
        getFn: getUserById,
        verifyFn: verify,
        status: 400, code: -10007, msg: "更新失败"
    })
    expect(getUserById).toHaveBeenCalledWith(headers.id)
    if (dbUser !== null) {
        expect(verify).toHaveBeenCalledWith(dbUser.password, body.old.password)
    }
})

test("should check sms code", async () => {
    const smsFn = jest.fn(async () => {
        return TKResponse.fromError(new CodeError())
    })
    await runTest({
        smsFn,
        status: 400, code: -10006, msg: "验证码错误"
    })
    expect(smsFn).toHaveBeenCalledWith(defaultBody.new.phone, defaultBody.smsCode)
})

test("should update db correctly", async () => {
    const updateAccount = jest.fn()
    const encode = jest.fn(async () => {
        return "encodedNewPassword"
    })
    await runTest({
        setFn: updateAccount,
        encodeFn: encode,
        status: 200, code: 0, msg: "更新成功", data: defaultResponseData
    })
    expect(updateAccount).toHaveBeenCalledWith(defaultHeaders.id, defaultBody.new.phone, "encodedNewPassword")
    expect(encode).toHaveBeenCalledWith(defaultBody.new.password)
})

test.concurrent.each([
    {
        tokenResponse: TKResponse.fromError(new InternalError()),
        status: 200, code: 0, msg: "更新成功，请重新登录", data: {}
    },
    {
        tokenResponse: TKResponse.Success({data: defaultResponseData}),
        status: 200, code: 0, msg: "更新成功", data: defaultResponseData
    }
])("($#) refresh token", async ({tokenResponse, status, code, msg, data}) => {
    const tokenFn = jest.fn(async () => {
        return tokenResponse
    })
    await runTest({
        tokenFn, status, code, msg, data
    })
    expect(tokenFn).toHaveBeenCalledWith({
        id: defaultHeaders.id,
        phone: defaultBody.new.phone
    })
})