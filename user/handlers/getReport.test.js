'use restrict'

import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";

test("get report by id", async () => {
    const getReport = jest.fn(async (id) => {
        return {
            _id: new ObjectId(id),
            msg: "report body"
        }
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getReport
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const reportId = new ObjectId()
    const userId = new ObjectId()
    const response = await supertest(app)
        .get(`/v1/user/report/${reportId}`)
        .set({id: userId.toString()})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            id: reportId.toString(),
            msg: "report body"
        }
    }))
    expect(getReport).toBeCalledWith(reportId.toString(), userId.toString())
})