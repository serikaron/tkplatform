'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";
import {jest} from "@jest/globals";

test("call db with correct argument", async () => {
    const getAnalyseDetail = jest.fn(async () => {
        return [
            "return what db return"
        ]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getAnalyseDetail
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const minDate = now()
    const maxDate = now() + 86400
    const response  = await supertest(app)
        .get(`/v1/ledger/analyse/detail/${minDate}/${maxDate}`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: ["return what db return"]
    }))
    expect(getAnalyseDetail).toHaveBeenCalledWith(`${userId}`, minDate, maxDate)
})