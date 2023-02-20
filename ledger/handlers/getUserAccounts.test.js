'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import {jest} from "@jest/globals";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("get user accounts from db" , async () => {
    const getUserAccounts = jest.fn(async () => {
        return [{
            msg: "a fake user account",
            _id: "a fake account id"
        }]
    })
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserAccounts
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get('/v1/user/ledger/accounts')
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, TKResponse.Success({
        data: [{
            msg: "a fake user account",
            id: "a fake account id"
        }]
    }))
    expect(getUserAccounts).toHaveBeenCalledWith("a fake user id")
})