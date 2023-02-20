'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {jest} from "@jest/globals";

async function runTest(
    {
        params,
        headers,
        tkResponse,
        dbFn
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getLedgerEntries: dbFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const path = '/v1/ledger/entries'
    const url = params === '' ? path : `${path}?${params}`
    const response = await supertest(app)
        .get(url)
        .set(headers)
    simpleCheckTKResponse(response, tkResponse)
}

test.concurrent.each([
    '',
    "minDate=abc",
    "maxDate=def",
    "minDate=123",
    "maxDate=123",
])("params should be right", async (params) => {
    await runTest({
        params,
        headers: {id: "a fake user id"},
        tkResponse: TKResponse.fromError(new InvalidArgument()),
        dbFn: async () => {
            return []
        }
    })
})

test.concurrent.each([
    {
        params: "minDate=123&maxDate=234",
        dbArguments: {minDate: 123, maxDate: 234, offset: null, limit: null}
    },
    {
        params: "minDate=123&maxDate=234&offset=abc",
        dbArguments: {minDate: 123, maxDate: 234, offset: null, limit: null}
    },
    {
        params: "minDate=123&maxDate=234&offset=1",
        dbArguments: {minDate: 123, maxDate: 234, offset: 1, limit: null}
    },
    {
        params: "minDate=123&maxDate=234&offset=1&limit=abc",
        dbArguments: {minDate: 123, maxDate: 234, offset: 1, limit: null}
    },
    {
        params: "minDate=123&maxDate=234&offset=1&limit=10",
        dbArguments: {minDate: 123, maxDate: 234, offset: 1, limit: 10}
    },
])("($#) query db and return", async ({params, dbArguments}) => {
    const getEntries = jest.fn(async () => {
        return [{msg: "a fake entry"}]
    })
    await runTest({
        params,
        headers: {id: "a fake user id"},
        tkResponse: TKResponse.Success({
            data: [{msg: "a fake entry"}]
        }),
        dbFn: getEntries
    })
    expect(getEntries).toHaveBeenCalledWith(dbArguments.minDate, dbArguments.maxDate, dbArguments.offset, dbArguments.limit)
})