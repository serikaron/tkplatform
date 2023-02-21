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
                        updateJournalEntry: dbFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .put("/v1/journal/entry/fake-entry-id")
        .send(body)
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, tkResponse)
}

test.concurrent.each([
    {
        body: {
            msg: "a fake entry body",
            id: "should ignore id",
            userId: "should ignore user id",
            createdAt: "should ignore create time"
        },
        update: {
            msg: "a fake entry body"
        }
    }
])("only credited can be updated", async ({body, update}) => {
    const updateJournalEntry = jest.fn()
    await runTest({
        body,
        tkResponse: TKResponse.Success(),
        dbFn: updateJournalEntry,
    })
    expect(updateJournalEntry).toHaveBeenCalledWith("fake-entry-id", "a fake user id", update)
})