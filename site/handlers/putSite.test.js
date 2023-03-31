'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";

test("update db", async () => {
    const updateSite = jest.fn()

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        updateSite
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const siteId = new ObjectId()
    const response = await supertest(app)
        .put(`/v1/site/${siteId}`)
        .send({disable: true})

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(updateSite).toHaveBeenCalledWith(siteId.toString(), {disable: true})
})