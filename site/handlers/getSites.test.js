"use restrict"

import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from '@jest/globals'
import {TKResponse} from "../../common/TKResponse.mjs";
import {setup} from "../setup.mjs";

async function runTest(
    {
        dbFn,
        tkResponse,
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getSites: dbFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get('/v1/sites')
    simpleCheckTKResponse(response, tkResponse)
}

test("should get from db and return", async () => {
    const sites = {msg: "a fake sites data"}
    const getSites = jest.fn(async () => {
        return sites
    })
    await runTest({
        dbFn: getSites,
        tkResponse: TKResponse.Success({
            data: sites
        })
    })
    expect(getSites).toHaveBeenCalled()
})