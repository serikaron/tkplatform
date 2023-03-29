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
        needAuth: false,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/account"
        }
    },
    {
        url: "/v1/user/password",
        method: "POST",
        needAuth: false,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/password"
        }
    },
    {
        url: "/v1/user/member",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/member"
        }
    },
    {
        url: "/v1/user/overview",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/overview"
        }
    },
    {
        url: "/v1/user/overview",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/overview"
        }
    },
    {
        url: "/v1/user/downLine/fake-user-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/downLine/fake-user-id",
        }
    },
    {
        url: "/v1/user/downLines",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/downLines",
        }
    },
    {
        url: "/v1/user/centre",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://user:8080",
            url: "/v1/user/centre",
        }
    },
    {
        url: "/v1/sites",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/sites"
        }
    },
    {
        url: "/v1/user/site/fake-site-id",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site/fake-site-id"
        }
    },
    {
        url: "/v1/user/sites",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/sites"
        }
    },
    {
        url: "/v1/user/site",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site"
        }
    },
    {
        url: "/v1/user/site/fake-site-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site/fake-site-id"
        }
    },
    {
        url: "/v1/user/sites",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/sites"
        }
    },
    {
        url: "/v1/user/site/fake-site-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site/fake-site-id",
        }
    },
    {
        url: "/v1/user/sites/balance",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/sites/balance"
        }
    },
    {
        url: "/v1/user/site/fake-site-id/balance",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site/fake-site-id/balance"
        }
    },
    {
        url: "/v1/user/site/journal/entries",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site/journal/entries",
        }
    },
    {
        url: "/v1/user/site/fake-site-id/journal/entry",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/user/site/fake-site-id/journal/entry",
        }
    },
    {
        url: "/v1/site/fake-site-id/recommend",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/site/fake-site-id/recommend",
        }
    },
    {
        url: "/v1/sites/statistics",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/sites/statistics",
        }
    },
    {
        url: "/v1/site/fake-site-id/logs",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/site/fake-site-id/logs",
        }
    },
    {
        url: "/v1/site/fake-site-id/logs",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: "/v1/site/fake-site-id/logs",
        }
    },
    {
        url: '/v1/user/site/fake-site-id/setting/sync',
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: '/v1/user/site/fake-site-id/setting/sync',
        }
    },
    {
        url: '/v1/user/site/fake-site-id/report',
        method: "POST",
        needAuth: true,
        service: {
            baseURL: 'http://site:8080',
            url: '/v1/user/site/fake-site-id/report'
        }
    },
    {
        url: '/v1/site/problem/templates',
        method: "GET",
        needAuth: true,
        service: {
            baseURL: 'http://site:8080',
            url: '/v1/site/problem/templates',
        }
    },
    {
        url: '/v1/missing/sites',
        method: "GET",
        needAuth: true,
        service: {
            baseURL: 'http://site:8080',
            url: '/v1/missing/sites'
        }
    },
    {
        url: '/v1/missing/site',
        method: "POST",
        needAuth: true,
        service: {
            baseURL: 'http://site:8080',
            url: '/v1/missing/site'
        }
    },

    // --------- site end -------------

    {
        url: "/v1/ledger/stores",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/stores"
        }
    },
    {
        url: "/v1/ledger/accounts",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/accounts"
        }
    },
    {
        url: "/v1/user/ledger/accounts",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/ledger/accounts",
        }
    },
    {
        url: "/v1/user/ledger/account",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/ledger/account",
        }
    },
    {
        url: "/v1/user/ledger/account/fake-account-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/ledger/account/fake-account-id",
        }
    },
    {
        url: "/v1/journal/accounts",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/accounts"
        }
    },
    {
        url: "/v1/user/journal/accounts",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/journal/accounts",
        }
    },
    {
        url: "/v1/user/journal/account",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/journal/account",
        }
    },
    {
        url: "/v1/user/journal/account/fake-account-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/journal/account/fake-account-id",
        }
    },
    {
        url: "/v1/user/ledger/account/fake-account-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/ledger/account/fake-account-id",
        }
    },
    {
        url: "/v1/user/journal/account/fake-account-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/user/journal/account/fake-account-id",
        }
    },
    {
        url: "/v1/ledger/entries/123/234?offset=1&limit=2",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/entries/123/234?offset=1&limit=2",
        }
    },
    {
        url: "/v1/ledger/entries/count?year=2023",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/entries/count?year=2023",
        }
    },
    {
        url: "/v1/ledger/entry/123",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/entry/123",
        }
    },
    {
        url: "/v1/ledger/entry",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/entry",
        }
    },
    {
        url: "/v1/ledger/entry/fake-entry-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/entry/fake-entry-id",
        }
    },
    {
        url: "/v1/ledger/statistics/123/234",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/statistics/123/234",
        }
    },
    {
        url: "/v1/journal/entries/123/234?offset=1&limit=2",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/entries/123/234?offset=1&limit=2",
        }
    },
    {
        url: "/v1/journal/entries/count?year=2023",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/entries/count?year=2023",
        }
    },
    {
        url: "/v1/journal/entry/fake-entry-id",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/entry/fake-entry-id",
        }
    },
    {
        url: "/v1/journal/entry",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/entry",
        }
    },
    {
        url: "/v1/journal/entry/fake-entry-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/entry/fake-entry-id",
        }
    },
    {
        url: "/v1/journal/statistics/123/234",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/statistics/123/234",
        }
    },
    {
        url: "/v1/site/fake-site-id/record",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/site/fake-site-id/record",
        }
    },
    {
        url: "/v1/site/records/123/234",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/site/records/123/234",
        }
    },
    {
        url: "/v1/site/fake-site-id/record/fake-record-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/site/fake-site-id/record/fake-record-id",
        }
    },
    {
        url: "/v1/site/fake-site-id/record/fake-record-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/site/fake-site-id/record/fake-record-id",
        }
    },
    {
        url: "/v1/ledger/sites",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/sites",
        }
    },
    {
        url: "/v1/ledger/site",
        method: "POST",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/site",
        }
    },
    {
        url: "/v1/ledger/site/fake-site-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/site/fake-site-id",
        }
    },
    {
        url: "/v1/ledger/templates",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/templates",
        }
    },
    {
        url: "/v1/ledger/template/fake-template-id",
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/template/fake-template-id",
        }
    },
    {
        url: "/v1/ledger/entries",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/entries",
        }
    },
    {
        url: "/v1/journal/entries",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/entries",
        }
    },
    {
        url: "/v1/ledger/analyse/overview/minDate/maxDate",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/analyse/overview/minDate/maxDate",
        }
    },
    {
        url: "/v1/ledger/analyse/detail/minDate/maxDate",
        method: "GET",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/analyse/detail/minDate/maxDate",
        }
    },
    {
        url: "/v1/ledger/entry/fake-entry-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/ledger/entry/fake-entry-id",
        }
    },
    {
        url: "/v1/journal/entry/fake-entry-id",
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: "http://ledger:8080",
            url: "/v1/journal/entry/fake-entry-id",
        }
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