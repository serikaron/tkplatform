'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import {now} from "../../common/utils.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("get statistics from db", async () => {
    const userId = new ObjectId()
    const minDate = now() - 86400
    const maxDate = now()
    const statistics = {
        _id: userId,
        notYetCredited: 100,
        credited: 1000,
    }
    const getJournalStatistics = jest.fn(async () => {
        return [statistics]
    })
    const sumLedgerPrinciple = jest.fn(async () => {
        return [{
            _id: userId,
            principle: 10000
        }]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getJournalStatistics,
                        sumLedgerPrinciple
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get(`/v1/journal/statistics/${minDate}/${maxDate}`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            notYetCredited: 100,
            credited: 1000,
            principle: 10000
        }
    }))
    expect(getJournalStatistics).toHaveBeenCalledWith(`${userId}`, minDate, maxDate)
})