'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {NotFound} from "../../common/errors/00000-basic.mjs";

describe.each([
    {key: "ledger", collectionName: "ledgerEntries"},
    {key: "journal", collectionName: "withdrawJournalEntries"},
])("$key", ({key, collectionName}) => {
    const entryId = new ObjectId()
    const userId = new ObjectId()
    describe.each([
        {
            dbEntry: {
                _id: entryId,
                userId,
                msg: "a fake entry",
            },
            tkResponse: TKResponse.Success({
                data: {
                    id: `${entryId}`,
                    msg: "a fake entry"
                }
            })
        },
        {
            dbEntry: null,
            tkResponse: TKResponse.fromError(new NotFound())
        }
    ])("($#) return from db", ({dbEntry, tkResponse}) => {
        it("", async () => {
            const getEntry = jest.fn(async () => {
                return dbEntry
            })
            const app = createApp()
            setup(app, {
                setup: testDIContainer.setup([
                    (req, res, next) => {
                        req.context = {
                            mongo: {
                                getEntry
                            }
                        }
                        next()
                    }
                ]),
                teardown: testDIContainer.teardown([])
            })

            const response = await supertest(app)
                .get(`/v1/${key}/entry/${entryId}`)
                .set({id: `${userId}`})
            simpleCheckTKResponse(response, tkResponse)
            expect(getEntry).toHaveBeenCalledWith(collectionName, `${entryId}`, `${userId}`)
        })
    })
})
