'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("put template should update db", async () => {
    const updateTemplate = jest.fn()

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        updateTemplate
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const templateId = new ObjectId()
    const userId = new ObjectId()
    const response = await supertest(app)
        .put(`/v1/ledger/template/${templateId}`)
        .set({id: `${userId}`})
        .send({
            id: "a fake template id",
            name: "tempalte-name",
            refund: {
                from: true
            }
        })

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(updateTemplate).toHaveBeenCalledWith(`${userId}`, `${templateId}`, {
        "name": "tempalte-name",
        "refund.from": true
    })
})