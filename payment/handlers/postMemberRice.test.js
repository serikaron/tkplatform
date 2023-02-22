'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {NotEnoughRice} from "../../common/errors/40000-payment.mjs";
import {jest} from "@jest/globals";

async function runTest(
    {
        systemFn = async () => {
            return 15
        },
        walletFn = async () => {
            return TKResponse.Success({
                data: 100
            })
        },
        tkResponse
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        payWithRices: walletFn,
                    },
                    system: {
                        getConfig: systemFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer([])
    })

    const response = await supertest(app)
        .post("/v1/member/rice")
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, tkResponse)
}

test.each([
    {
        response: TKResponse.fromError(new NotEnoughRice()),
    },
    {
        response: TKResponse.Success({
            data: {
                rice: 100
            }
        })
    }
])("$# return result of wallet update", async ({response}) => {
    // const systemFn = jest.fn(async () => {
    //     return 15
    // })
    // const walletFn = jest.fn(async () => {
    //     return response
    // })
    // await runTest({
    //     systemFn,
    //     walletFn,
    //     tkResponse: response
    // })
    // expect(systemFn).toHaveBeenCalledWith("memberPriceRice")
    // expect(walletFn).toHaveBeenCalledWith("a fake user id", 15)
})