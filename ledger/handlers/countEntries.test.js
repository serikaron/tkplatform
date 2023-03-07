'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {jest} from "@jest/globals";

describe.each([
    {key: "ledger", collectionName: "ledgerEntries"},
    {key: "journal", collectionName: "withdrawJournalEntries"}
])("test counting $key entries", ({key, collectionName}) => {
    describe.each([
        "",
        "?year=abc",
    ])
    ("invalid year input (%s)", (queryString) => {
        it("should return failed", async () => {
            const app = createApp()
            setup(app, {
                setup: testDIContainer.setup([]),
                teardown: testDIContainer.teardown([])
            })

            const response = await supertest(app)
                .get(`/v1/${key}/entries/count${queryString}`)

            simpleCheckTKResponse(response, TKResponse.fromError(new InvalidArgument()))
        })
    })

    it("should call db with correct argument", async () => {
        const countEntries = jest.fn(async () => {
            return [
                {_id: 1, count: 3},
                {_id: 2, count: 10}
            ]
        })

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            countEntries
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const userId = new ObjectId()
        const response = await supertest(app)
            .get(`/v1/${key}/entries/count?year=2012`)
            .set({id: `${userId}`})

        simpleCheckTKResponse(response, TKResponse.Success({
            data: [
                {month: 1, count: 3},
                {month: 2, count: 10}
            ]
        }))
        expect(countEntries).toHaveBeenCalledWith(collectionName, `${userId}`, 2012)
    })
})