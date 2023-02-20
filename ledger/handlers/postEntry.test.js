'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";

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
                        addEntry: dbFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/site/fake-site-id/entry")
        .send(body)
        .set(headers)

    simpleCheckTKResponse(response, tkResponse)
}

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
    expect(addEntry).toHaveBeenCalledWith("a fake user id", "fake-site-id", {msg: "a fake entry body"})
})