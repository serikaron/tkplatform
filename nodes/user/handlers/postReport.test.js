'use restrict'

import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";

test("report should add to db", async () => {
    const reportId = new ObjectId()
    const addReport = jest.fn(async () => {
        return reportId
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addReport
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .post('/v1/user/report')
        .set({id: userId.toString()})
        .send({msg: "report body"})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {id: reportId.toString()}
    }))
    expect(addReport).toBeCalledWith(userId.toString(), {msg: "report body"})
})