'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";

test("return db result", async () => {
    const siteId = new ObjectId()
    const countSitesRecords = jest.fn(async () => {
        return [{siteId, count: 0}]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        countSitesRecords
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .get('/v1/sites/records/count')
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: [{siteId: `${siteId}`, count: 0}]
    }))
    expect(countSitesRecords).toHaveBeenCalledWith(`${userId}`, now(), now() + 86400)
})