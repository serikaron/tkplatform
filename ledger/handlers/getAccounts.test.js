'use restrict'


import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("get account from db", async () => {
    const getAccounts = jest.fn( async () => {
        return [{
            msg: "a fake account",
        }]
    })
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getAccounts
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get('/v1/ledger/accounts')
    simpleCheckTKResponse(response, TKResponse.Success({
        data: [{
            msg: "a fake account",
        }]
    }))
    expect(getAccounts).toHaveBeenCalled()
})