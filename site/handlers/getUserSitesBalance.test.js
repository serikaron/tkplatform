'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("get balance from userSites", async () => {
    const userId = new ObjectId()
    const userSiteId = new ObjectId()

    const getUserSitesBalance = jest.fn(async () => {
        return [
            {
                _id: userSiteId,
                userId,
                site: {
                    name: "site-name"
                },
                credential: {
                    account: "account",
                    password: "password",
                },
                balance: 100
            }
        ]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserSitesBalance
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get("/v1/user/sites/balance?siteId=abc")
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: [{
            id: `${userSiteId}`,
            site: {
                name: "site-name",
            },
            credentialAccount: "account",
            credentialPassword: "password",
            balance: 100
        }]
    }))

    expect(getUserSitesBalance).toHaveBeenCalledWith(`${userId}`, "abc")
})