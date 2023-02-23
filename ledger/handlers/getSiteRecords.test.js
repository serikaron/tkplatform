'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";

test("get site record from db", async () => {
    const getSiteRecords = jest.fn(async () => {
        return [{msg: "a fake site record"}]
    })
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getSiteRecords
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get("/v1/site/fake-site-id/records")
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, TKResponse.Success({
        data: [{msg: "a fake site record"}]
    }))
    expect(getSiteRecords).toHaveBeenCalledWith("a fake user id", "fake-site-id")
})