'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("get sites from db", async () => {
    const siteId = new ObjectId()
    const getLedgerSites = jest.fn(async () => {
        return [{
            _id: siteId,
            name: "site-name",
            account: "custom-account",
        }]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getLedgerSites
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .get('/v1/ledger/sites')
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: [{
            id: `${siteId}`,
            name: "site-name",
            account: "custom-account"
        }]
    }))
    expect(getLedgerSites).toHaveBeenCalledWith(`${userId}`)
})