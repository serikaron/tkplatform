'use restrict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {InternalError, NotFound} from "../../common/errors/00000-basic.mjs";
import {ObjectId} from "mongodb";
import {now} from "../../common/utils.mjs";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals";

const expiration = now()
const registeredAt = now()

describe.each([
    {
        dbUser: null,
        responseUser: null,
    },
    {
        dbUser: {
            member: {
                expiration,
            },
            registeredAt,
            name: "userName",
            contact: {
                qq: {
                    account: "qq",
                    open: false
                },
                wechat: {
                    account: "wechat",
                    open: false
                },
                phone: {
                    open: true
                }
            }
        },
        responseUser: {
            member: {
                expiration,
            },
            registeredAt,
            name: "userName",
            contact: {
                qq: {
                    account: "qq",
                    open: false
                },
                wechat: {
                    account: "wechat",
                    open: false
                },
                phone: {
                    open: true
                }
            },
            activeDays: {
                "30": 0,
                total: 0
            }
        }
    }
])("($#) information from db", ({dbUser, responseUser}) => {
    describe.each([
        {
            siteResponse: TKResponse.fromError(new InternalError()),
            siteCount: 0
        },
        {
            siteResponse: TKResponse.Success({data: {count: 10}}),
            siteCount: 10
        }
    ])("($#) site count from site", ({siteResponse, siteCount}) => {
        describe.each([
            {
                paymentResponse: TKResponse.fromError(new InternalError()),
                rechargeCount: 0
            },
            {
                paymentResponse: TKResponse.Success({data: {count: 10}}),
                rechargeCount: 10
            }
        ])("($#) recharge count from payment", ({paymentResponse, rechargeCount}) => {
            const userId = new ObjectId()
            const downLineId = new ObjectId()
            describe.each([
                {
                    toGetId: downLineId,
                    usingId: downLineId,
                },
                {
                    usingId: userId,
                },
            ])("($#) query with id", ({toGetId, usingId}) => {
                test("combine all information", async () => {
                    const getOverview = jest.fn(async () => {
                        return dbUser
                    })
                    const countUserSites = jest.fn(async () => {
                        return siteResponse
                    })
                    const countRecharge = jest.fn(async () => {
                        return paymentResponse
                    })
                    const app = createApp()
                    setup(app, {
                        setup: testDIContainer.setup([
                            (req, res, next) => {
                                req.context = {
                                    mongo: {
                                        getOverview
                                    },
                                    stubs: {
                                        site: {
                                            countUserSites
                                        },
                                        payment: {
                                            countRecharge
                                        }
                                    }
                                }
                                next()
                            }
                        ]),
                        teardown: testDIContainer.teardown([])
                    })

                    const query = toGetId === undefined ? "" : `?id=${toGetId}`
                    const response = await supertest(app)
                        .get(`/v1/user/overview${query}`)
                        .set({id: `${userId}`})

                    if (responseUser === null) {
                        simpleCheckTKResponse(response, TKResponse.fromError(new NotFound()))
                        return
                    }

                    responseUser.rechargeCount = rechargeCount
                    responseUser.siteCount = siteCount
                    simpleCheckTKResponse(response, TKResponse.Success({data: responseUser}))
                    expect(countUserSites).toHaveBeenCalledWith(`${usingId}`)
                    expect(countRecharge).toHaveBeenCalledWith(`${usingId}`)
                    expect(getOverview).toHaveBeenCalledWith(`${usingId}`)
                })
            })
        })
    })
})
