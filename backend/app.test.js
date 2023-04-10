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
        case "PUT":
            agent = agent.put(url).send(body)
            break
        case "DELETE":
            agent = agent.del(url)
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
    if (service.url === undefined || service.url === null) {
        service.url = url
    }

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

    const body = method === "GET" || method === "DELETE" ? undefined : {
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

test.concurrent.each([
    {
        url: '/backend/v1/register',
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://user:8080", url: "/v1/backend/register"}
    },
    {
        url: "/backend/v1/login",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/backend/login"
        }
    },
    {
        url: "/backend/v1/user/fake-user-id",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: "/v1/backend/user/fake-user-id"}
    },
    {
        url: "/backend/v1/users",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: "/v1/backend/users"}
    },
    // ----- user end ----------

    {url: "/backend/v1/site", method: "POST", needAuth: true, service: {baseURL: "http://site:8080", url: "/v1/site"}},
    {url: "/backend/v1/sites", method: "GET", needAuth: true, service: {baseURL: "http://site:8080", url: "/v1/sites"}},
    {
        url: "/backend/v1/site/fake-site-id",
        method: "PUT",
        needAuth: true,
        service: {baseURL: "http://site:8080", url: "/v1/site/fake-site-id"}
    },
    // ----- site end -----

    {
        url: "/backend/v1/user/fake-user-id/wallet/", method: "GET", needAuth: true, service: {
            baseURL: "http://payment:8080",
            url: '/v1/backend/user/fake-user-id/wallet'
        }
    },
    {
        url: "/backend/v1/system/settings",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://system:8080", url: "/v1/system/settings"}
    },
    {
        url: "/backend/v1/system/setting",
        method: "PUT",
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/setting'}
    },
])("$url should dispatch correctly", async (argument) => {
    await runTest(argument)
})

test.skip("only one for debug", async () => {
    await runTest({
        url: "/v1/user/site/fake-site-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site/fake-site-id",
        }
    })
})