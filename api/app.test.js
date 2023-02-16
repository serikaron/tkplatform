'use restrict'

import createApp from "../common/app.mjs";
import {setup} from "./setup.mjs";
import testDIContainer from "../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {sign} from "./sign.mjs";
import dotenv from "dotenv";
import {jest} from "@jest/globals"
import {simpleCheckResponse} from "../tests/unittest/test-runner.mjs";
import {TKResponse} from "../common/TKResponse.mjs";

dotenv.config()

function makeHeaders(url, body, needAuth) {
    const timestamp = Math.floor(Date.now() / 1000)
    const s = sign(url, body, timestamp, process.env.SECRET_KEY)
    return needAuth ? {
        signature: s.signature,
        authentication: "this is a fake token"
    } : {
        signature: s.signature,
    }
}

async function callAgent(app, url, method, needAuth, body) {
    let agent = supertest(app)

    switch (method) {
        case "GET":
            agent = agent.get(url)
            break
        case "POST":
            agent = agent.post(url).send(body)
            break
    }

    agent.set(makeHeaders(url, body, needAuth))

    return agent;
}

async function runTest(
    {
        url,
        method,
        needAuth,
        service = {
            baseURL,
            url
        }
    }
) {
    const tokenFn = jest.fn(async () => {
        return TKResponse.Success({
            data: {
                msg: "this is a fake token payload"
            }
        })
    })
    const serviceFn = jest.fn(async (config) => {
        return TKResponse.Success({
            data: config.data
        })
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    stubs: {
                        token: {
                            verify: tokenFn
                        },
                        service: {
                            call: serviceFn
                        }
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const body = method === "GET" ? undefined : {
        msg: "this is a fake body"
    }
    const response = await callAgent(app, url, method, needAuth, body)

    simpleCheckResponse(response, 200, 0, "success", body === undefined ? {} : body)
    if (needAuth) {
        expect(tokenFn).toHaveBeenCalledWith("this is a fake token")
    }

    const expectConfig = {
        baseURL: service.baseURL,
        url: service.url,
        method: method,
        data: body,
        headers: needAuth ? {
            msg: "this is a fake token payload"
        } : {}
    }
    expect(serviceFn).toHaveBeenCalledWith(expectConfig)
}

test.each([
    {
        url: "/v1/captcha/require",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://captcha:8080",
            url: "/v1/captcha/require"
        }
    },
    {
        url: "/v1/sms/send",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://sms:8080",
            url: "/v1/sms/send"
        }
    },
    {
        url: '/v1/user/register',
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/register"
        }
    },
    {
        url: "/v1/user/login",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/login"
        }
    },
    {
        url: "/v1/user/account",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/account"
        }
    },
    {
        url: "/v1/user/password",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/password"
        }
    },
    {
        url: "/v1/system/sites",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://system:8080",
            url: "/v1/system/setting/sites"
        }
    }
])("$url should dispatch correctly", async (argument) => {
    await runTest(argument)
})