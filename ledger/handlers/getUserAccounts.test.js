'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import {jest} from "@jest/globals";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {
        path: "/v1/user/ledger/accounts",
        ledgerFn: jest.fn(async () => {
            return [{
                msg: "a fake ledger account",
                _id: "a fake account id"
            }]
        }),
        resBody: [{
            msg: "a fake ledger account",
            id: "a fake account id"
        }]
    },
    {
        path: "/v1/user/journal/accounts",
        journalFn: jest.fn(async () => {
            return [{
                msg: "a fake journal account",
                _id: "a fake account id"
            }]
        }),
        resBody: [{
            msg: "a fake journal account",
            id: "a fake account id"
        }]
    },
])("$path", ({path, ledgerFn, journalFn, resBody}) => {
    test("get user accounts from db", async () => {
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getUserLedgerAccounts: ledgerFn,
                            getUserJournalAccounts: journalFn
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .get(path)
            .set({id: "a fake user id"})
        simpleCheckTKResponse(response, TKResponse.Success({
            data: resBody
        }))
        if (ledgerFn !== undefined) {
            expect(ledgerFn).toHaveBeenCalledWith("a fake user id")
        }
        if (journalFn !== undefined) {
            expect(journalFn).toHaveBeenCalledWith("a fake user id")
        }
    })
})
