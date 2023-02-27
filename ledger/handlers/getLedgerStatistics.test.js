'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {now} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("get statistics from db", async () => {
    const statistics = {
        exceptions: 1,
        notYetRefunded: 10,
        principle: 100,
        commission: 1000
    };
    const getLedgerStatistics = jest.fn(async () => {
        return [statistics]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getLedgerStatistics,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const minDate = now() - 86400
    const maxDate = now()
    const userId = new ObjectId()
    const response = await supertest(app)
        .get(`/v1/ledger/statistics/${minDate}/${maxDate}`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: statistics
    }))
    expect(getLedgerStatistics).toHaveBeenCalledWith(`${userId}`, minDate, maxDate)
})