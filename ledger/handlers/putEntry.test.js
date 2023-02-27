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
        key,
        body,
        headers,
        tkResponse,
        setFn,
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        setEntry: setFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .put(`/v1/${key}/entry/fake-entry-id`)
        .send(body)
        .set(headers)
    simpleCheckTKResponse(response, tkResponse)
}

describe.each([
    {
        key: "ledger", collectionName: "ledgerEntries",
    },
    {
        key: "journal", collectionName: "withdrawJournalEntries"
    }
])("$key", ({key, collectionName}) => {
    test.concurrent.each([
        {
            body: {
                msg: "an entry body",
                userId: "should ignore user id",
                id: "should ignore id",
                createdAt: "should ignore create time",
            },
            update: {
                msg: "an entry body",
            },
            count: 1
        },
        {
            body: {},
            update: {},
            count: 0
        },
        {
            body: {
                field: {
                    nestedField: "a new entry body",
                }
            },
            update: {
                "field.nestedField": "a new entry body"
            },
            count: 1
        }
    ])("should update entry according to body", async ({body, update, count}) => {
        const setFn = jest.fn()
        await runTest({
            key,
            body,
            headers: {id: "a fake user id"},
            tkResponse: TKResponse.Success(),
            setFn,
        })
        expect(setFn).toBeCalledTimes(count)
        if (count > 0) {
            expect(setFn).toHaveBeenCalledWith(collectionName, "fake-entry-id", "a fake user id", update)
        }
    })
})
