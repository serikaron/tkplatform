'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import {now} from "../../common/utils.mjs";

async function runTest(
    {
        path,
        params,
        headers,
        tkResponse,
        getEntries,
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getEntries,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const url = params === '' ? path : `${path}${params}`
    const response = await supertest(app)
        .get(url)
        .set(headers)
    simpleCheckTKResponse(response, tkResponse)
}

const RealDate = Date.now
const mockNow = () => {
    return 0
}

beforeAll(() => {
    // global.Date.now = () => { return 1677571421 }
    global.Date.now = mockNow
})

afterAll(() => {
    global.Date.now = RealDate
})

describe.each([
    {
        key: "ledger",
        dbName: "ledgerEntries"
    },
    {
        key: "journal",
        dbName: "withdrawJournalEntries"
    }
])("$path", ({key, dbName}) => {
    describe.each([
        {
            minDate: "abc",
            maxDate: "abc",
            params: "?offset=abc&limit=abc",
            dbArguments: {minDate: mockNow() - 86400, maxDate: mockNow(), offset: null, limit: null}
        },
        {
            minDate: "123",
            maxDate: "234",
            params: "",
            dbArguments: {minDate: 123, maxDate: 234, offset: null, limit: null}
        },
        {
            minDate: "123",
            maxDate: "234",
            params: "?offset=1&limit=1",
            dbArguments: {minDate: 123, maxDate: 234, offset: 1, limit: 1}
        },
        {
            minDate: "1677254400",
            maxDate: "1677340800",
            params: "?offset=0&limit=1",
            dbArguments: {minDate: 1677254400, maxDate: 1677340800, offset: 0, limit: 1}
        }
    ])("with input ($#)", ({minDate, maxDate, params, dbArguments}) => {
        test("should be work as expect", async () => {
            const getEntries = jest.fn(async () => {
                return {
                    total: 1,
                    items: [{
                        msg: "a fake entry",
                        _id: "a fake entry id",
                        userId: "should not send"
                    }]
                }
            })

            const userId = `${new ObjectId()}`
            await runTest({
                path: `/v1/${key}/entries/${minDate}/${maxDate}`,
                params,
                headers: {id: userId},
                tkResponse: TKResponse.Success({
                    data: {
                        total: 1,
                        items: [{
                            id: "a fake entry id",
                            msg: "a fake entry",
                        }]
                    }
                }),
                getEntries
            })
            expect(getEntries).toHaveBeenCalledWith(dbName, userId, dbArguments.minDate, dbArguments.maxDate, dbArguments.offset, dbArguments.limit, {})
        })
    })

    test.each([
        {params: "?siteName=a-site-name", optionalFilter: {siteName: "a-site-name"},},
        {params: "?siteId=a-site-id", optionalFilter: {siteId: "a-site-id"},},
        {params: "?refundStatus=0", optionalFilter: {}},
        {params: "?refundStatus=1", optionalFilter: {refundStatus: 1}},
        {params: "?refundStatus=2", optionalFilter: {refundStatus: 2}},
        {params: "?refundStatus=3", optionalFilter: {refundStatus: 3}},
        {params: "?refundStatus=4", optionalFilter: {refundStatus: 4}},
        {params: "?refundFrom=0", optionalFilter: {}},
        {params: "?refundFrom=1", optionalFilter: {refundFrom: 1}},
        {params: "?refundFrom=2", optionalFilter: {refundFrom: 2}},
        {params: "?storeId=a-store-id", optionalFilter: {storeId: "a-store-id"}},
        {params: "?key=a-search-key", optionalFilter: {key: "a-search-key"}},
        {params: "?minPrinciple=123", optionalFilter: {minPrinciple: 123}},
        {params: "?maxPrinciple=456", optionalFilter: {maxPrinciple: 456}},
        {params: "?minAmount=678", optionalFilter: {minAmount: 678}},
        {params: "?maxAmount=789", optionalFilter: {maxAmount: 789}},
        {params: "?credited=0", optionalFilter: {}},
        {params: "?credited=1", optionalFilter: {credited: 1}},
        {
            params: "?siteName=a-site-name&siteId=a-site-id&refundStatus=1&refundFrom=1&storeId=a-store-id&key=a-search-key&minPrinciple=123&maxPrinciple=456",
            optionalFilter: {
                siteName: "a-site-name",
                siteId: "a-site-id",
                refundStatus: 1,
                refundFrom: 1,
                storeId: "a-store-id",
                key: "a-search-key",
                minPrinciple: 123,
                maxPrinciple: 456
            }
        }
    ])
    ("($#) params should be correctly translate", async ({params, optionalFilter}) => {
        const getEntries = jest.fn(async () => {
            return {
                total: 1,
                items: [{
                    msg: "a fake entry",
                    _id: "a fake entry id",
                    userId: "should not send"
                }]
            }
        })

        const userId = `${new ObjectId()}`
        const minDate = now()
        const maxDate = now() + 86400
        await runTest({
            path: `/v1/${key}/entries/${minDate}/${maxDate}`,
            params,
            headers: {id: userId},
            tkResponse: TKResponse.Success({
                data: {
                    total: 1,
                    items: [{
                        id: "a fake entry id",
                        msg: "a fake entry",
                    }]
                }
            }),
            getEntries
        })
        expect(getEntries).toHaveBeenCalledWith(dbName, userId, minDate, maxDate, null, null, optionalFilter)
    })
})
