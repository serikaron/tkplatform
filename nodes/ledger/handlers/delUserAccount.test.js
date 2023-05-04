'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {key: "ledger", delUserLedgerAccount: jest.fn()},
    {key: "journal", delUserJournalAccount: jest.fn()}
])("testing $key", ({key, delUserLedgerAccount, delUserJournalAccount}) => {
    it("should delete user account", async () => {
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            delUserJournalAccount,
                            delUserLedgerAccount,
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const accountId = new ObjectId()
        const userId =  new ObjectId()
        const response = await supertest(app)
            .del(`/v1/user/${key}/account/${accountId}`)
            .set({id: `${userId}`})

        simpleCheckTKResponse(response, TKResponse.Success())
        if (delUserLedgerAccount) {
            expect(delUserLedgerAccount).toHaveBeenCalledWith(`${accountId}`, `${userId}`)
        }
        if (delUserJournalAccount) {
            expect(delUserJournalAccount).toHaveBeenCalledWith(`${accountId}`, `${userId}`)
        }
    })
})