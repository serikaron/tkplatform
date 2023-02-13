'use restrict'

import createApp from "../common/app.mjs";
import {setup} from "./setup.mjs";
import testDIContainer from "../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {jest} from "@jest/globals"
import {simpleCheckResponse} from "../tests/unittest/test-runner.mjs";

async function runTest(
    {
        body = {phone: "13333333333"},
        captchaFn,
        redisSet,
        status, code, msg, data = {}
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    redis: {
                        setCaptcha: redisSet
                    },
                    captcha: {
                        get: captchaFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/captcha/require")
        .send(body)
    simpleCheckResponse(response, status, code, msg, data)
}

test("invalid phone should return InvalidArgument", async () => {
    await runTest({
        body: {phone: "1111"},
        status: 400, code: -1, msg: "参数错误"
    })
})

test("save captcha and return data", async () => {
    const fn = jest.fn()
    await runTest({
        body: {phone: "13333333333"},
        captchaFn: () => {
            return {
                text: "a1b2",
                data: "mockCaptchaData"
            }
        },
        redisSet: fn,
        status: 200, code: 0, msg: "success", data: {
            captcha: "mockCaptchaData"
        }
    })
    expect(fn).toBeCalledWith("13333333333", "a1b2")
})