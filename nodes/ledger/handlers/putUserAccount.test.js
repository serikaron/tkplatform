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
        path: "/v1/user/ledger/account/fake-account-id",
        ledgerFn: jest.fn(),
    },
    {
        path: "/v1/user/journal/account/fake-account-id",
        journalFn: jest.fn(),
    },
])("$path", ({path, journalFn, ledgerFn}) => {
test("update account", async () => {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        setUserLedgerAccount: ledgerFn,
                        setUserJournalAccount: journalFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .put(path)
        .send({
            msg: "a fake account body",
            id: "an illegal account id",
            userId: "an illegal user id"
        })
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, TKResponse.Success())
    if (ledgerFn !== undefined) {
        expect(ledgerFn).toHaveBeenCalledWith("fake-account-id", "a fake user id", {
            msg: "a fake account body",
        })
    }
    if (journalFn !== undefined) {
        expect(journalFn).toHaveBeenCalledWith("fake-account-id", "a fake user id", {
            msg: "a fake account body",
        })
    }
})
})
