'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("add to db correctly", async () => {
    const addMissing = jest.fn()

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addMissing
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .post('/v1/missing/site')
        .set({id: `${userId}`})
        .send({msg: "missing site content"})

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(addMissing).toHaveBeenCalledWith(`${userId}`, {
        missing: {msg: "missing site content"},
        operate: {status: 0, comment: "", thumb: false}
    })
})
