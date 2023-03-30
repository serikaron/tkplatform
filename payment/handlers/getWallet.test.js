"use restrict"

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {
        dbWallet: {},
        tkWallet: {
            rice: 0,
            cash: 0,
            invitePoint: 0,
        }
    },
    {
        dbWallet: null,
        tkWallet: {
            rice: 0,
            cash: 0,
            invitePoint: 0,
        }
    },
    {
        dbWallet: {
            rice: 1000,
            cash: 2000,
            invitePoint: 3000,
        },
        tkWallet: {
            rice: 1000,
            cash: 2000,
            invitePoint: 3000,
        }
    },
])("($#) wallet scenario", ({dbWallet, tkWallet}) => {
    test("get wallet from db", async () => {
        const getWallet = jest.fn(async () => {
            return dbWallet
        })
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getWallet,
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .get("/v1/wallet")
            .set({id: "a fake user id"})
        simpleCheckTKResponse(response, TKResponse.Success({
            data: tkWallet
        }))
        expect(getWallet).toHaveBeenCalledWith("a fake user id")
    })
})
