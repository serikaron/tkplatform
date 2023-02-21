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
        setFn,
        keepFn,
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        setLedgerEntry: setFn,
                        keepALedger: keepFn,
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
    {
        body: {
            msg: "an entry body",
            userId: "should ignore user id",
            id: "should ignore id",
            createdAt: "should ignore create time",
            keptAt: "should ignore keep time"
        },
        update: {
            msg: "an entry body",
        }
    },
])("should update entry according to body", async ({body, update}) => {
    const setFn = jest.fn()
    const keepFn = jest.fn()
    await runTest({
        body,
        headers: {id: "a fake user id"},
        tkResponse: TKResponse.Success(),
        setFn,
        keepFn,
    })
    expect(setFn).toHaveBeenCalledWith("fake-entry-id", "a fake user id", update)
    expect(keepFn).toHaveBeenCalledWith("fake-entry-id", "a fake user id")
})