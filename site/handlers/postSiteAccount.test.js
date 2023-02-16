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
                        addSiteAccount: updateFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/site/fake-site-id/account")
        .set(headers)
        .send(body)
    simpleCheckResponse(response, tkResponse.status, tkResponse.code, tkResponse.msg, tkResponse.data)
}

describe('test add site', function () {
    test.concurrent.each([
        {
            reqBody: {name: "account-name", password: "account-password"},
            resBody: {
                id: "fake id 1",
                name: "account-name", password: "account-password"
            },
            callCount: 1
        },
        {
            reqBody: {
                name: "account-name", password: "account-password",
                billAccounts: [
                    {
                        platform: {name: "platform-name", icon: "platform-icon"},
                        name: "bill-account-name"
                    }
                ]
            },
            resBody: {
                id: "fake id 1",
                name: "account-name", password: "account-password",
                billAccounts: [
                    {
                        id: "fake id 2",
                        platform: {name: "platform-name", icon: "platform-icon"},
                        name: "bill-account-name"
                    }
                ]
            },
            callCount: 2
        },
        {
            reqBody: {
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
            },
            resBody: {
                id: "fake id 1",
                name: "account-name", password: "account-password",
                billAccounts: [
                    {
                        id: "fake id 2",
                        platform: {name: "platform-name", icon: "platform-icon"},
                        name: "bill-account-name"
                    },
                    {
                        id: "fake id 3",
                        platform: {name: "platform-name", icon: "platform-icon"},
                        name: "bill-account-name"
                    },
                ]
            },
            callCount: 3
        }
    ])("($#) should work as expect", async ({reqBody, resBody, callCount}) => {
        let currentId = 0
        const objectId = jest.fn(() => {
            currentId++
            return `fake id ${currentId}`
        })
        const addSiteAccount = jest.fn()
        await runTest({
            body: reqBody,
            headers: {
                id: "fake user id",
                phone: "13333333333",
            },
            idFn: objectId,
            updateFn: addSiteAccount,
            tkResponse: TKResponse.Success({
                data: resBody
            })
        })
        expect(objectId).toBeCalledTimes(callCount)
        expect(addSiteAccount).toHaveBeenCalledWith("fake user id", "fake-site-id", resBody)
    })
});