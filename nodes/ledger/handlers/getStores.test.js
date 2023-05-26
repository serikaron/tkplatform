'use restrict'

import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {setup} from "../setup.mjs";

test("get store from db", async () => {
    const getStores = jest.fn(async () => {
        return [{msg: "a fake store item"}]
    })
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getStores
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get('/v1/stores')
    simpleCheckTKResponse(response, TKResponse.Success({
        data: [{msg: "a fake store item"}]
    }))
    expect(getStores).toHaveBeenCalled()
})