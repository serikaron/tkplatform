'use restrict'


import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {
        path: "/v1/ledger/accounts",
        ledgerFn: jest.fn(async () => {
            return [{
                msg: "a fake ledger account",
            }]
        }),
        rspBody: [{
            msg: "a fake ledger account"
        }]
    },
    {
        path: "/v1/journal/accounts",
        journalFn: jest.fn(async () => {
            return [{
                msg: "a fake journal account",
            }]
        }),
        rspBody: [{
            msg: "a fake journal account"
        }]
    },
])("$path", ({path, journalFn, ledgerFn, rspBody}) => {
    test("get account from db", async () => {
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getLedgerAccounts: ledgerFn,
                            getJournalAccounts: journalFn,
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .get(path)
        simpleCheckTKResponse(response, TKResponse.Success({
            data: rspBody
        }))
        if (journalFn !== undefined) {
            expect(journalFn).toHaveBeenCalled()
        }
        if (ledgerFn !== undefined) {
            expect(ledgerFn).toHaveBeenCalled()
        }
    })
})