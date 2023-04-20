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
        url: "/backend/v1/captcha/require",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://captcha:8080",
            url: "/v1/captcha/require"
        }
    },
    {
        url: "/backend/v1/sms/send",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://sms:8080",
            url: "/v1/sms/send"
        }
    },
    {
        url: '/backend/v1/admin/register',
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://user:8080", url: "/v1/backend/register"}
    },
    {
        url: "/backend/v1/admin/login",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/backend/login"
        }
    },
    {
        url: '/backend/v1/user/register',
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://user:8080", url: "/v1/user/register"}
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
    {
        url: "/backend/v1/user/message",
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: "/v1/user/message"}
    },
    {
        url: '/backend/v1/user/messages',
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: '/v1/backend/user/messages'}
    },
    {
        url: '/backend/v1/user/reports',
        method: 'GET',
        needAuth: true,
        service: {baseURL: 'http://user:8080', url: '/v1/backend/user/reports'}
    },
    // ----- user end ----------

    {url: "/backend/v1/site", method: "POST", needAuth: true, service: {baseURL: "http://site:8080", url: "/v1/site"}},
    {
        url: "/backend/v1/sites",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://site:8080", url: "/v1/backend/sites"}
    },
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
    {
        url: "/backend/v1/system/versions",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/versions/all'}
    },
    {
        url: "/backend/v1/system/version",
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/version'}
    },
    {
        url: "/backend/v1/system/version/fake-id",
        method: "DELETE",
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/version/fake-id'}
    },

    // ----- question -----
    {
        url: "/backend/v1/system/questions",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/backend/questions'}
    },
    {
        url: "/backend/v1/system/question/q-id/answer",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://system:8080", url: "/v1/system/question/q-id/answer"}
    },
    {
        url: '/backend/v1/system/question',
        method: 'POST',
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/question'}
    },
    {
        url: '/backend/v1/system/question/q-id',
        method: 'PUT',
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/question/q-id'}
    },
    {
        url: '/backend/v1/system/question/q-id',
        method: 'DELETE',
        needAuth: true,
        service: {baseURL: "http://system:8080", url: '/v1/system/question/q-id'}
    },
    // ----- question end-----

    // ----- payment -----
    {
        url: '/backend/v1/member/items',
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/member/items"}
    },
    {
        url: '/backend/v1/member/item/add',
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/member/item/add"}
    },
    {
        url: '/backend/v1/member/item/update',
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/member/item/update"}
    },
    {
        url: '/backend/v1/member/item/delete',
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/member/item/delete"}
    },
    {
        url: '/backend/v1/rice/items',
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/rice/items"}
    },
    {
        url: '/backend/v1/rice/item/add',
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/rice/item/add"}
    },
    {
        url: '/backend/v1/rice/item/update',
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/rice/item/update"}
    },
    {
        url: '/backend/v1/rice/item/delete',
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://apid:9010", url: "/v1/api/store/rice/item/delete"}
    },
    // ----- payment end -----

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