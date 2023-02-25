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
        ledgerFn,
        journalFn
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getLedgerEntries: ledgerFn,
                        getJournalEntries: journalFn
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

describe.each([
    {
        path: "/v1/ledger/entries",
        ledgerFn: jest.fn(),
    },
    // {
    //     path: "/v1/journal/entries",
    //     journalFn: jest.fn(async () => {
    //         return [{
    //             msg: "a fake entry",
    //             _id: "a fake entry id"
    //         }]
    //     })
    // }
])("$path", ({path, ledgerFn, journalFn}) => {
    describe.each([
        {
            minDate: "abc",
            maxDate: "abc",
            params: "?offset=abc&limit=abc",
            dbArguments: {minDate: now()-86400, maxDate: now(), offset: null, limit: null}
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
        describe("with response from db", () => {

            const dbRes = [{
                msg: "a fake entry",
                _id: "a fake entry id",
                userId: "should not send"
            }]
            const responseBody = [{
                id: "a fake entry id",
                msg: "a fake entry",
            }]

            test("should be work as expect", async () => {
                if (ledgerFn !== undefined) {
                    ledgerFn.mockImplementation(async () => {
                        return dbRes
                    })
                }
                if (journalFn !== undefined) {
                    journalFn.mockImplementation(async () => {
                        return dbRes
                    })
                }

                const userId = `${new ObjectId()}`
                await runTest({
                    path: `${path}/${minDate}/${maxDate}`,
                    params,
                    headers: {id: userId},
                    tkResponse: TKResponse.Success({
                        data: responseBody
                    }),
                    ledgerFn,
                    journalFn
                })
                if (ledgerFn !== undefined) {
                    expect(ledgerFn).toHaveBeenCalledWith(userId, dbArguments.minDate, dbArguments.maxDate, dbArguments.offset, dbArguments.limit)
                }
                if (journalFn !== undefined) {
                    expect(journalFn).toHaveBeenCalledWith(userId, dbArguments.minDate, dbArguments.maxDate, dbArguments.offset, dbArguments.limit)
                }
            })
        })
    })
})