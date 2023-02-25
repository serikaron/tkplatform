'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";

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
                        addLedgerEntry: dbFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/ledger/entry")
        .send(body)
        .set(headers)

    simpleCheckTKResponse(response, tkResponse)
}

const userId = new ObjectId()
const RealDate = Date.now
const fakeNow = () => {
    return 0
}

beforeAll(() => {
    global.Date.now = fakeNow
})

afterAll(() => {
    global.Date.now = RealDate
})

describe.each([
    {
        body: {
            msg: "a fake entry",
            createdAt: 12345
        },
        entryToSave: {
            userId,
            msg: "a fake entry",
            createdAt: 12345
        }
    },
    {
        body: {
            msg: "a fake entry",
        },
        entryToSave: {
            userId,
            msg: "a fake entry",
            createdAt: fakeNow()
        }
    }
])("($#)", ({body, entryToSave}) => {
    test("should add correct entry to db", async () => {
        const addEntry = jest.fn(async () => {
            return "a fake entry id"
        })
        await runTest({
            body,
            headers: {id: `${userId}`},
            tkResponse: TKResponse.Success({
                data: {entryId: "a fake entry id"}
            }),
            dbFn: addEntry
        })
        expect(addEntry).toHaveBeenCalledWith(entryToSave)
    })
})
