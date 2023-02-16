"use restrict"

import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {TKResponse} from "../../common/TKResponse.mjs";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {setup} from "../setup.mjs";
import {jest} from "@jest/globals";

async function runTest(
    {
        body,
        headers,
        idFn,
        updateFn,
        tkResponse = TKResponse.Success()
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        objectId: idFn,
                        addUserSite: updateFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/site")
        .set(headers)
        .send(body)
    simpleCheckResponse(response, tkResponse.status, tkResponse.code, tkResponse.msg, tkResponse.data)
}

describe('test add site', function () {
    test.concurrent.each([
        {
            reqBody: {site: {name: "site-name", icon: "site-icon"}},
            resBody: {
                id: "fake id 1",
                site: {name: "site-name", icon: "site-icon"},
            },
            callCount: 1
        },
        {
            reqBody: {
                site: {name: "site-name", icon: "site-icon"},
                account: {name: "account-name", password: "account-password"}
            },
            resBody: {
                id: "fake id 1",
                site: {name: "site-name", icon: "site-icon"},
                account: {
                    id: "fake id 2",
                    name: "account-name", password: "account-password"
                }
            },
            callCount: 2
        },
        {
            reqBody: {
                site: {name: "site-name", icon: "site-icon"},
                account: {
                    name: "account-name", password: "account-password",
                    billAccounts: [
                        {
                            platform: {name: "platform-name", icon: "platform-icon"},
                            name: "bill-account-name"
                        }
                    ]
                }
            },
            resBody: {
                id: "fake id 1",
                site: {name: "site-name", icon: "site-icon"},
                account: {
                    id: "fake id 2",
                    name: "account-name", password: "account-password",
                    billAccounts: [
                        {
                            id: "fake id 3",
                            platform: {name: "platform-name", icon: "platform-icon"},
                            name: "bill-account-name"
                        }
                    ]
                }
            },
            callCount: 3
        },
        {
            reqBody: {
                site: {name: "site-name", icon: "site-icon"},
                account: {
                    name: "account-name", password: "account-password",
                    billAccounts: [
                        {
                            platform: {name: "platform-name", icon: "platform-icon"},
                            name: "bill-account-name"
                        },
                        {
                            platform: {name: "platform-name", icon: "platform-icon"},
                            name: "bill-account-name"
                        }
                    ]
                }
            },
            resBody: {
                id: "fake id 1",
                site: {name: "site-name", icon: "site-icon"},
                account: {
                    id: "fake id 2",
                    name: "account-name", password: "account-password",
                    billAccounts: [
                        {
                            id: "fake id 3",
                            platform: {name: "platform-name", icon: "platform-icon"},
                            name: "bill-account-name"
                        },
                        {
                            id: "fake id 4",
                            platform: {name: "platform-name", icon: "platform-icon"},
                            name: "bill-account-name"
                        },
                    ]
                }
            },
            callCount: 4
        }
    ])("($#) should work as expect", async ({reqBody, resBody, callCount}) => {
        let currentId = 0
        const objectId = jest.fn(() => {
            currentId++
            return `fake id ${currentId}`
        })
        const addUserSite = jest.fn()
        await runTest({
            body: reqBody,
            headers: {
                id: "fake user id",
                phone: "13333333333",
            },
            idFn: objectId,
            updateFn: addUserSite,
            tkResponse: TKResponse.Success({
                data: resBody
            })
        })
        expect(objectId).toBeCalledTimes(callCount)
        expect(addUserSite).toHaveBeenCalledWith("fake user id", resBody)
    })
});