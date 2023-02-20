'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";
import {now} from "../../common/utils.mjs";

async function runTest(
    {
        body,
        headers,
        tkResponse,
        dbFn
    }
){
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addLedgerEntry: dbFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/ledger/fake-site-id/entry")
        .send(body)
        .set(headers)

    simpleCheckTKResponse(response, tkResponse)
}

const RealDate = Date.now

beforeAll(() => {
    global.Date.now = () => { return 0 }
})

afterAll(() => {
    global.Date.now = RealDate
})

test("should add entry to db", async () => {
    const addEntry = jest.fn(async () => {
        return "a fake entry id"
    })
    await runTest({
        body: {msg: "a fake entry body"},
        headers: {id: "a fake user id"},
        tkResponse: TKResponse.Success({
            data: {entryId: "a fake entry id"}
        }),
        dbFn: addEntry
    })
    expect(addEntry).toHaveBeenCalledWith( {
        userId: "a fake user id",
        siteId: "fake-site-id",
        msg: "a fake entry body",
        kept: false,
        createAt: now()
    })
})