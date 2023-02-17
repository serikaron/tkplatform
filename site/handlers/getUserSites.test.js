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
        header,
        getUserSites,
        tkResponse,
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserSites
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get('/v1/user/sites')
        .set(header)
    simpleCheckTKResponse(response, tkResponse)
}

test("should return sites from db", async () => {
    const getUserSites = jest.fn(async () => {
        return {
            sites: [
                {msg: "fake user sites"},
                {msg: "fake user sites too"}
            ]
        }
    })
    await runTest({
        header: {id: "fake user id"},
        getUserSites,
        tkResponse: TKResponse.Success({
            data: [
                {msg: "fake user sites"},
                {msg: "fake user sites too"},
            ]
        })
    })
    expect(getUserSites).toHaveBeenCalledWith("fake user id")
})

// TODO: check db return null