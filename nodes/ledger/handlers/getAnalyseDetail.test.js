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
        return {
            ledger: [
                {
                    _id: "id1",
                    site: "site-1",
                    total: 100,
                    principle: 100,
                    commission: 100
                },
                {
                    _id: "id2",
                    site: "site-2",
                    total: 200,
                    principle: 200,
                    commission: 200
                }
            ],
            journal: [
                {
                    _id: "id1",
                    site: "site-1",
                    withdrawingSum: 1000,
                },
                {
                    _id: "id3",
                    site: "site-3",
                    withdrawingSum: 3000,
                },
            ]
        }
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
        data: [
            {
                site: "site-1",
                total: 100,
                principle: 100,
                commission: 100,
                withdrawingSum: 1000,
            },
            {
                site: "site-2",
                total: 200,
                principle: 200,
                commission: 200,
                withdrawingSum: 0,
            },
            {
                site: "site-3",
                total: 0,
                principle: 0,
                commission: 0,
                withdrawingSum: 3000,
            },
        ]
    }))
    expect(getAnalyseDetail).toHaveBeenCalledWith(`${userId}`, minDate, maxDate)
})