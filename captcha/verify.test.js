"use restrict"

import createApp from "../common/app.mjs";
import {setup} from "./setup.mjs";
import testDIContainer from "../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckResponse} from "../tests/unittest/test-runner.mjs";
import {jest} from '@jest/globals'

async function runTest(
    {
        params = {phone: "13333333333", code: "a1b2"},
        redisGet,
        status, code, msg, data = {}
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    redis: {
                        getCaptcha: redisGet
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get(`/v1/captcha/verify/${params.phone}/${params.code}`)
    simpleCheckResponse(response, status, code, msg, data)
}

test.each([
    {
        params: {phone: "1111", code: "1234"},
    },
])("bad input ($#) should return InvalidArgument", async (params) => {
    await runTest({
        params,
        status: 400, code: -1, msg: "参数错误"
    })
})

test.each([
    {
        params: {phone: "13333333333", code: "a1b2"},
        redisGet: jest.fn(async () => {
            return "ddcc"
        }),
        status: 400, code: -30004, msg: "图形码错误"
    },
    {
        params: {phone: "13333333333", code: "1234"},
        redisGet: jest.fn(async () => {
            return null
        }),
        status: 400, code: -30004, msg: "图形码错误"
    },
    {
        params: {phone: "13333333333", code: "a1b2"},
        redisGet: jest.fn(async () => {
            return "a1b2"
        }),
        status: 200, code: 0, msg: "success"
    }
])("case ($#) verify result should return", async ({params, redisGet, status, code, msg}) => {
    await runTest({
        params, redisGet, status, code, msg
    })
    expect(redisGet).toBeCalledWith(params.phone)
})