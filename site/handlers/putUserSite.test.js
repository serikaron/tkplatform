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
        setUserSiteOne,
        tkResponse
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        setUserSiteOne
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .put('/v1/user/site/fake-site-id')
        .send(body)
        .set(headers)
    simpleCheckTKResponse(response, tkResponse)
}

test('set one site according to site id', async () => {
    const setUserSiteOne = jest.fn()
    await runTest({
        body: {
            id: "possible bad id",
            site: {name: "site-name", icon: "site-icon"}
        },
        headers: {
            id: "fake user id",
            phone: "13333333333",
        },
        setUserSiteOne,
        tkResponse: TKResponse.Success()
    })
    expect(setUserSiteOne).toHaveBeenCalledWith("fake user id", "fake-site-id", {
        id: "fake-site-id",
        site: {name: "site-name", icon: "site-icon"},
    })
});

