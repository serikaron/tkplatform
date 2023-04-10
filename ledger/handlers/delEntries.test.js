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
    const path = (key, year, month) => {
        const query = {year}
        if (month !== undefined) {
            query.month = month
        }
        return `/v1/${key}/entries?${new URLSearchParams(query)}`
    }
    describe("year is required, and month should be an array", () => {
        describe.each([
            {year: "2023", month: "abc"},
            {year: "2023", month: "abc,def"},
            {year: "2023", month: "0"},
            {year: "2023", month: "13"},
            {year: "2023", month: "1,2,3,13"},
        ])
        ("invalid input ($#)", ({year, month}) => {
            it("should return failed", async () => {
                const app = createApp()
                setup(app, {
                    setup: testDIContainer.setup([]),
                    teardown: testDIContainer.teardown([])
                })

                const response = await supertest(app)
                    .del(path(key, year, month))

                simpleCheckTKResponse(response, TKResponse.fromError(new InvalidArgument()))
            })
        })
    })

    describe.each([
        {
            year: "2023",
            month: "1,2,3,4,5,6,7,8,9,10,11,12",
            dbArguments: [{
                from: dateToTimestamp(2023, 1, 1),
                to: dateToTimestamp(2024, 1, 1)
            }]
        }, {
            year: "2023",
            month: "1",
            dbArguments: [{
                from: dateToTimestamp(2023, 1, 1),
                to: dateToTimestamp(2023, 2, 1)
            }]
        }, {
            year: "2023",
            month: "1,3",
            dbArguments: [{
                from: dateToTimestamp(2023, 1, 1),
                to: dateToTimestamp(2023, 2, 1)
            }, {
                from: dateToTimestamp(2023, 3, 1),
                to: dateToTimestamp(2023, 4, 1)
            }]
        }, {
            year: "2023",
            month: "12",
            dbArguments: [{
                from: dateToTimestamp(2023, 12, 1),
                to: dateToTimestamp(2024, 1, 1)
            }]
        }, {
            year: "2023",
            dbArguments: [{
                from: dateToTimestamp(2023, 1, 1),
                to: dateToTimestamp(2024, 1, 1)
            }]
        }
    ])("input from query ($#)", ({year, month, dbArguments}) => {
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

                const userId = new ObjectId()
                const response = await supertest(app)
                    .del(path(key, year, month))
                    .set({id: `${userId}`})

                simpleCheckTKResponse(response, TKResponse.Success())
                dbArguments.forEach((a, i) => {
                    expect(delEntries).toHaveBeenNthCalledWith(i + 1, collectionName, `${userId}`, a.from, a.to)
                })
            })
        })
    })
})

describe('clear import should ignore year and month', () => {
    const query = {
        import: 1,
        month: 1
    }

    test("clear import entries", async () => {
        const delImportEntries = jest.fn()

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            delImportEntries
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const userId = new ObjectId()
        const response = await supertest(app)
            .del(`/v1/ledger/entries?import=${query.import}&month=${query.month}`)
            .set({id: userId.toString()})

        simpleCheckTKResponse(response, TKResponse.Success())
        expect(delImportEntries).toHaveBeenCalledWith(userId.toString())
    })
})

describe("clear by date should ignore year and month", () => {
    const query = {
        date: "123",
        month: "1"
    }

    test("clear entries by date", async () => {
        const delEntriesByDate = jest.fn()

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            delEntriesByDate
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const userId = new ObjectId()
        const response = await supertest(app)
            .del(`/v1/ledger/entries?${new URLSearchParams(query)}`)
            .set({id: userId.toString()})

        simpleCheckTKResponse(response, TKResponse.Success())
        expect(delEntriesByDate).toHaveBeenCalledWith(userId.toString(), 123)
    })
})

describe.each([
    {
        key: "ledger",
        query: {month: "1"}
    },
    {
        key: "journal",
        query: {month: "1"}
    },
    {
        key: "journal",
        query: {import: "1", month: "1"}
    },
    {
        key: "journal",
        query: {date: "123", month: "1"}
    }
])
("($#) error input", ({key, query}) => {
    test("should return error", async () => {
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([]),
            teardown: testDIContainer.teardown([])
        })

        const userId = new ObjectId()
        const response = await supertest(app)
            .del(`/v1/${key}/entries?${new URLSearchParams(query).toString()}`)
            .set({id: userId.toString()})

        simpleCheckTKResponse(response, TKResponse.fromError(new InvalidArgument()))
    })
})
