'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("delete site from db", async () => {
    const delLedgerSite = jest.fn()

    const app = await createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        delLedgerSite
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const siteId = new ObjectId()
    const userId = new ObjectId()
    const response = await supertest(app)
        .del(`/v1/ledger/site/${siteId}`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(delLedgerSite).toHaveBeenCalledWith(`${siteId}`, `${userId}`)
})