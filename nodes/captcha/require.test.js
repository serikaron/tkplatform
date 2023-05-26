'use restrict'

import createApp from "../common/app.mjs";
import {setup} from "./setup.mjs";
import testDIContainer from "../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {jest} from "@jest/globals"
import {simpleCheckResponse} from "../tests/unittest/test-runner.mjs";

async function runTest(
    {
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
    simpleCheckResponse(response, status, code, msg, data)
}

test("save captcha and return data", async () => {
    const fn = jest.fn()
    await runTest({
        captchaFn: async () => {
            return {
                key: "1234",
                text: "a1b2",
                image: "mockCaptchaData"
            }
        },
        redisSet: fn,
        status: 200, code: 0, msg: "success", data: {
            key: "1234",
            image: "mockCaptchaData"
        }
    })
    expect(fn).toBeCalledWith("1234", "a1b2")
})