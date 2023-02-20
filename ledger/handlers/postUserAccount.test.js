'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("add user account to db", async () => {
    const addUserAccount = jest.fn(async () => {
        return "a fake account id"
    })
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addUserAccount
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/ledger/account")
        .send({msg: "a fake account body"})
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, TKResponse.Success({
        data: {accountId: "a fake account id"}
    }))
    expect(addUserAccount).toHaveBeenCalledWith({
        userId: "a fake user id",
        msg: "a fake account body"
    })
})