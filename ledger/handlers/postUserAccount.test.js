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
        path: "/v1/user/ledger/account",
        ledgerFn: jest.fn(async () => {
            return "a fake ledger account id"
        }),
        resBody: {accountId: "a fake ledger account id"}
    },
    {
        path: "/v1/user/journal/account",
        journalFn: jest.fn(async () => {
            return "a fake journal account id"
        }),
        resBody: {accountId: "a fake journal account id"}
    },
])("$path", ({path, journalFn, ledgerFn, resBody}) => {
    test("add user account to db", async () => {
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            addUserLedgerAccount: ledgerFn,
                            addUserJournalAccount: journalFn,
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .post(path)
            .send({msg: "a fake account body"})
            .set({id: "a fake user id"})
        simpleCheckTKResponse(response, TKResponse.Success({
            data: resBody
        }))
        if (ledgerFn !== undefined) {
            expect(ledgerFn).toHaveBeenCalledWith({
                userId: "a fake user id",
                msg: "a fake account body"
            })
        }
        if (journalFn !== undefined) {
            expect(journalFn).toHaveBeenCalledWith({
                userId: "a fake user id",
                msg: "a fake account body"
            })
        }
    })
})
