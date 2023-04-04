'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import supertest from "supertest";

test("get reports from db", async () => {
    const reportIds = [new ObjectId(), new ObjectId()]
    const getReports = jest.fn(async () => {
        return reportIds.map(x => {
            return {
                _id: x,
                msg: "report body"
            }
        })
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getReports
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .get('/v1/user/reports')
        .set({id: userId.toString()})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: reportIds.map(x => {
            return {
                id: x.toString(),
                msg: "report body"
            }
        })
    }))
    expect(getReports).toBeCalledWith(userId.toString())
})