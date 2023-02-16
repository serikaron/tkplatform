"use restrict"

import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {TKResponse} from "../../common/TKResponse.mjs";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {setup} from "../setup.mjs";

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

describe('test add site', function () {
    it("should work as expect", async () => {
        await runTest({
            body: {
                site: {
                    id: "site-id",
                    name: "site-name",
                    icon: "site-icon",
                }
            }
        })
    })
});