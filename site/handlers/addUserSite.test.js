"use restrict"

import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {TKResponse} from "../../common/TKResponse.mjs";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {setup} from "../setup.mjs";
import {jest} from "@jest/globals";

async function runTest(
    {
        body,
        headers,
        idFn,
        updateFn,
        tkResponse = TKResponse.Success()
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        objectId: idFn,
                        addUserSite: updateFn,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/site")
        .set(headers)
        .send(body)
    simpleCheckResponse(response, tkResponse.status, tkResponse.code, tkResponse.msg, tkResponse.data)
}

describe('test add site', function () {
    it("should work as expect", async () => {
        const objectId = jest.fn(() => {
            return "fake object id"
        })
        const addUserSite = jest.fn()
        const siteInfo = {
            site: {
                name: "site-name",
                icon: "site-icon",
            },
            account: {
                name: "account name",
                password: "site account password",
            }
        }
        await runTest({
            body: siteInfo,
            headers: {
                id: "fake user id",
                phone: "13333333333",
            },
            idFn: objectId,
            updateFn: addUserSite,
            tkResponse: TKResponse.Success({
                data: {
                    newSiteId: "fake object id"
                }
            })
        })
        expect(objectId).toBeCalledTimes(1)
        expect(addUserSite).toHaveBeenCalledWith("fake user id", "fake object id", siteInfo)
    })
});