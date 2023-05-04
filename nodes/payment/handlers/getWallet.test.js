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
        path: '/v1/wallet',
        header: {id: 'a-fake-user-id'},
        userId: 'a-fake-user-id',
    },
    {
        path: '/v1/backend/user/user-id-for-backend/wallet',
        header: {},
        userId: 'user-id-for-backend'
    }
])
("$path", ({path, header, userId}) => {
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
                .get(path)
                .set(header)
            simpleCheckTKResponse(response, TKResponse.Success({
                data: tkWallet
            }))
            expect(getWallet).toHaveBeenCalledWith(userId)
        })
    })
})
