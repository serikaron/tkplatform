"use restrict"

import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {TKResponse} from "../../common/TKResponse.mjs";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";

async function runTest(
    {
        body,
        headers,
        tkResponse = TKResponse.Success()
    }
) {
    const app = createApp()
    setup(app, {
        setup: {
            setup: testDIContainer.setup([]),
            teardown: testDIContainer.teardown([])
        }
    })

    const response = await supertest(app)
        .post("/v1/user/site")
        .set(headers)
        .send(body)
    simpleCheckResponse(response, tkResponse.status, tkResponse.code, tkResponse.msg, tkResponse.data)
}