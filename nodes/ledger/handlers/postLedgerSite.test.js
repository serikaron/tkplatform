'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {setup} from "../setup.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("add site to db", async () => {
    const siteId = new ObjectId()
    const addLedgerSite = jest.fn(async () => {
        return siteId
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addLedgerSite
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .post("/v1/ledger/site")
        .send({
            name: "site-name",
            account: "custom-account"
        })
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {id: `${siteId}`}
    }))
    expect(addLedgerSite).toHaveBeenCalledWith({
        userId: userId,
        name: "site-name",
        account: "custom-account"
    })
})