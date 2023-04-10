'use restrict'

import {jest} from "@jest/globals";
import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {InternalError} from "../../common/errors/00000-basic.mjs";

const runTest = async (
    {
        getUserById = async () => {
            return null
        },
        getConfig = async () => {
            return 10
        },
        updateWallet = async () => {
            return TKResponse.Success()
        },
        updateClaimed = async () => {
        },
        upLine,
        downLine,
        tkResponse,
    }
) => {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserById,
                        updateClaimed
                    },
                    stubs: {
                        system: {
                            settings: {
                                get: getConfig,
                            }
                        },
                        payment: {
                            updateWallet,
                        }
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post(`/v1/user/downLine/${downLine}/claim`)
        .set({id: upLine.toString()})
    simpleCheckTKResponse(response, tkResponse)
}

const presetDownLine = new ObjectId()
describe.each([
    {downLines: []},
    {downLines: [{id: "invalid id"}]},
    {downLines: [{id: presetDownLine, claimed: true}]}
])
("invalid downLine ($#)", ({downLines}) => {
    it("should return failed", async () => {
        const getUserById = jest.fn(async () => {
            return {
                downLines
            }
        })

        const downLine = presetDownLine
        const upLine = new ObjectId()
        await runTest({
            getUserById,
            upLine,
            downLine,
            tkResponse: TKResponse.fromError(new InternalError())
        })
        expect(getUserById).toHaveBeenCalledWith(upLine.toString())
    })
})

describe.each([
    {
        config: {},
        invitePrice: 10,
    },
    {
        config: 20,
        invitePrice: 20
    }
])
("with config ($#)", ({config, invitePrice}) => {
    test("claim the price", async () => {
        const upLine = new ObjectId()
        const downLine = new ObjectId()

        const getConfig = jest.fn(async () => {
            return TKResponse.Success({
                data: config
            })
        })
        const getUserById = jest.fn(async () => {
            return {
                downLines: [{
                    id: downLine
                }]
            }
        })
        const updateClaimed = jest.fn()
        const updateWallet = jest.fn(async () => {
            return TKResponse.Success()
        })

        await runTest({
            getUserById,
            getConfig,
            updateWallet,
            updateClaimed,
            upLine,
            downLine,
            tkResponse: TKResponse.Success()
        })

        expect(getConfig).toHaveBeenCalledWith("claimDownLinePrice")
        expect(getUserById).toHaveBeenCalledWith(upLine.toString())
        expect(updateClaimed).toHaveBeenCalledWith(upLine.toString(), downLine.toString())
        expect(updateWallet).toHaveBeenCalledWith(upLine.toString(), {invitePoint: invitePrice})
    })
})
