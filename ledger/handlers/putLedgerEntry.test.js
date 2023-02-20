'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals";
import {TKResponse} from "../../common/TKResponse.mjs";

async function runTest(
    {
        body,
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
                        updateLedgerEntry: dbFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .put("/v1/ledger/entry/fake-entry-id")
        .send(body)
        .set(headers)
    simpleCheckTKResponse(response, tkResponse)
}

test.concurrent.each([
    {body: {kept: true}, update: {kept: true}},
    {body: {kept: false}, update: null},
    {body: {commission: true, principle: false}, update: {commission: {refunded: true}, principle: {refunded: false}}},
    {body: {}, update: null},
    {body: {willNotHandle: false}, update: null},
    {body: {commission: 123}, update: null},
])("should update entry according to body", async ({body, update}) => {
    const setKept = jest.fn()
    await runTest({
        body,
        headers: {id: "a fake user id"},
        tkResponse: TKResponse.Success(),
        dbFn: setKept,
    })
    if (update !== null) {
        expect(setKept).toHaveBeenCalledWith("fake-entry-id", "a fake user id", update)
    }
})