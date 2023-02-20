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
        dbFn,
        tkResponse
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addJournalEntry: dbFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/journal/entry")
        .send({msg: "a fake entry"})
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, tkResponse)
}

const RealDate = Date.now

beforeAll(() => {
    global.Date.now = () => {
        return 0
    }
})

afterAll(() => {
    global.Date.now = RealDate
})

test("should add journal entry to db", async () => {
    const addJournalEntry = jest.fn(async () => {
        return "a fake entry id"
    })
    await runTest({
        dbFn: addJournalEntry,
        tkResponse: TKResponse.Success({
            data: {entryId: "a fake entry id"}
        })
    })
    expect(addJournalEntry).toHaveBeenCalledWith({
        userId: "a fake user id",
        msg: "a fake entry",
        createdAt: now()
    })
})
