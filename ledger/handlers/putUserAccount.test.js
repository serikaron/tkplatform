'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("update account", async () => {
    const setUserAccount = jest.fn()
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        setUserAccount
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .put("/v1/user/ledger/account/fake-account-id")
        .send({
            msg: "a fake account body",
            id: "an illegal account id",
            userId: "an illegal user id"
        })
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, TKResponse.Success())
    expect(setUserAccount).toHaveBeenCalledWith("a fake user id", "fake-account-id", {
        msg: "a fake account body",
    })
})