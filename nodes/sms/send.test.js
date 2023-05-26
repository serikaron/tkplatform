'use restrict'

import createApp from "../common/app.mjs";
import supertest from "supertest";
import {simpleCheckResponse} from "../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals"
import {TKResponse} from "../common/TKResponse.mjs";
import testDIContainer from "../tests/unittest/dicontainer.mjs";
import {setup} from "./setup.mjs";
import {InternalError} from "../common/errors/00000-basic.mjs";

const defaultBody = {phone: "13333333333", captcha: {key: "1234", code: "a1b2"}}
const successVerifyFn = async () => {
    return new TKResponse(200, {code: 0, msg: "success"})
}

async function runTest(
    {
        body = defaultBody,
        verifyFn = successVerifyFn,
        smsFn,
        redisGet,
        redisSet,
        status, code, msg, data = {}
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    stubs: {
                        captcha: {
                            verify: verifyFn
                        }
                    },
                    sms: {
                        code: () => {
                            return 3456
                        },
                        send: smsFn
                    },
                    redis: {
                        getCode: redisGet,
                        setCode: redisSet,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/sms/send")
        .send(body)
    simpleCheckResponse(response, status, code, msg, data)
}

test.concurrent.each([
    {phone: "13333333333", captcha: {key: "1234"}},
    {captcha: {code: "1a2b", key: "1234"}},
    {phone: "13333333333", captcha: {code: "1a2b"}},
    {phone: "1234", captcha: {code: "1a2b", key: "1234"}},
])("invalid body ($#) should return InvalidArgument", async (body) => {
    await runTest({
        body,
        status: 400,
        code: -1,
        msg: "参数错误"
    })
})

test.concurrent.each([
    {
        name: "call stub failed",
        verifyFn: jest.fn(async () => {
            throw new InternalError()
        }),
        status: 500, code: -2, msg: "内部错误"
    },
    {
        name: "check captcha failed",
        verifyFn: jest.fn(async () => {
            return new TKResponse(200, {code: -1, msg: "error"})
        }),
        status: 400, code: -30001, msg: "图形验证码错误"
    }
])("$name should return SendFailed", async ({verifyFn, status, code, msg}) => {
    await runTest({
        verifyFn, status, code, msg
    })
    expect(verifyFn).toHaveBeenCalledWith("1234", "a1b2")
})

test.concurrent.each([
    {
        redisGet: jest.fn(async () => {
            return null
        }),
        redisSet: jest.fn(),
    },
    {
        redisGet: jest.fn(async () => {
            return 1234
        }),
        redisSet: null
    }
])("redis should be called expected", async ({redisGet, redisSet}) => {
    await runTest({
        redisGet, redisSet,
        smsFn: async () => {
            return 0
        },
        status: 200, code: 0, msg: "发送成功"
    })
    expect(redisGet).toBeCalled()
    if (redisSet !== null) {
        expect(redisSet).toBeCalledWith("13333333333", "3456")
    }
})

test.concurrent.each([
    {smsCode: 0, status: 200, code: 0, msg: "发送成功"},
    {smsCode: -1, status: 500, code: -30002, msg: "发送短信失败"},
    {smsCode: -2, status: 500, code: -30002, msg: "发送短信失败"},
])("send sms result ($#) should feedback to client", async ({smsCode, status, code, msg}) => {
    const fn = jest.fn(() => {
        return smsCode
    })

    await runTest({
        smsFn: fn,
        redisGet: async () => {
            return "8888"
        },
        status, code, msg
    })
    expect(fn).toHaveBeenCalledWith("13333333333", "8888")
})