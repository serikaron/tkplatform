'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {jest} from "@jest/globals";
import {dateToTimestamp} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

describe.each([
    {key: "ledger", collectionName: "ledgerEntries"},
    {key: "journal", collectionName: "withdrawJournalEntries"}
])("testing $key", ({key, collectionName}) => {
    describe("year is required, and month should be an array", () => {
        describe.each([
            {queryString: ""},
            {queryString: "?year=abc"},
            {queryString: "?year=2021&month=abc"},
            {queryString: "?year=2021&month=abc&month=aaa"},
            {queryString: "?year=2021&month=0"},
            {queryString: "?year=2021&month=13"},
            {queryString: "?year=2021&month=0&month=1"},
            {queryString: "?year=2021&month=13&month=1"},
            {queryString: "?year=2021&month=13&month=0"},
        ])
        ("invalid input ($#)", ({queryString}) => {
            it("should return failed", async () => {
                const app = createApp()
                setup(app, {
                    setup: testDIContainer.setup([]),
                    teardown: testDIContainer.teardown([])
                })

                const path = `/v1/${key}/entries${queryString}`
                const response = await supertest(app)
                    .del(path)

                simpleCheckTKResponse(response, TKResponse.fromError(new InvalidArgument()))
            })
        })
    })

    describe.each([
        {
            queryString: "?year=2023",
            dbArguments: [{
                from: dateToTimestamp(2023, 1, 1),
                to: dateToTimestamp(2024, 1, 1)
            }]
        }, {
            queryString: "?year=2023&month=1",
            dbArguments: [{
                from: dateToTimestamp(2023, 1, 1),
                to: dateToTimestamp(2023, 2, 1)
            }]
        }, {
            queryString: "?year=2023&month=1&month=3",
            dbArguments: [{
                from: dateToTimestamp(2023, 1, 1),
                to: dateToTimestamp(2023, 2, 1)
            }, {
                from: dateToTimestamp(2023, 3, 1),
                to: dateToTimestamp(2023, 4, 1)
            }]
        }, {
            queryString: "?year=2023&month=12",
            dbArguments: [{
                from: dateToTimestamp(2023, 12, 1),
                to: dateToTimestamp(2024, 1, 1)
            }]
        }
    ])("input from query ($#)", ({queryString, dbArguments}) => {
        describe("delete entries from db", () => {
            it("should be ok", async () => {
                const delEntries = jest.fn()

                const app = createApp()
                setup(app, {
                    setup: testDIContainer.setup([
                        (req, res, next) => {
                            req.context = {
                                mongo: {
                                    delEntries
                                }
                            }
                            next()
                        }
                    ]),
                    teardown: testDIContainer.teardown([])
                })

                const path = `/v1/${key}/entries${queryString}`
                const userId = new ObjectId()
                const response = await supertest(app)
                    .del(path)
                    .set({id: `${userId}`})

                simpleCheckTKResponse(response, TKResponse.Success())
                dbArguments.forEach((a, i) => {
                    expect(delEntries).toHaveBeenNthCalledWith(i+1, collectionName, `${userId}`, a.from, a.to)
                })
            })
        })
    })
})
