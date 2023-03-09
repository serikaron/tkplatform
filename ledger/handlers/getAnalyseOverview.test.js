'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";

test("get overview with correct db arguments", async () => {
    const getAnalyseOverview = jest.fn(async () => {
        return {
            overview: "return overview from db",
            exception: {
                count: 1,
                principle: 10,
                commission: 20,
            },
            commission: "return commission from db",
            principle: "return principle from db",
            cardDetail: "return card detail from db"
        }
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getAnalyseOverview
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const minDate = now()
    const maxDate = now()+86400
    const response = await supertest(app)
        .get(`/v1/ledger/analyse/overview/${minDate}/${maxDate}`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            overview: "return overview from db",
            exception: {
                count: 1,
                principle: 10,
                commission: 20,
                amount: 30,
            },
            commission: "return commission from db",
            principle: "return principle from db",
            cardDetail: "return card detail from db"
        }
    }))
    expect(getAnalyseOverview).toHaveBeenCalledWith(`${userId}`, minDate, maxDate)
})