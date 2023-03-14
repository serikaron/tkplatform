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
    {key: "ledger", collectionName: "ledgerEntries"},
    {key: "journal", collectionName: "withdrawJournalEntries"}
])
("$key", ({key, collectionName}) => {
    test('call db with correct arguments', async () => {
        const delEntry = jest.fn()

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            delEntry
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const entryId = new ObjectId()
        const userId = new ObjectId()
        const response = await supertest(app)
            .del(`/v1/${key}/entry/${entryId}`)
            .set({id: `${userId}`})

        simpleCheckTKResponse(response, TKResponse.Success())
        expect(delEntry).toHaveBeenCalledWith(collectionName, `${entryId}`, `${userId}`)
    })
})
