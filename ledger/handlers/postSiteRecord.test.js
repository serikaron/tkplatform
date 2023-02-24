'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";
import {now} from "../../common/utils.mjs";


const RealDate = Date.now

beforeAll(() => {
    global.Date.now = () => { return 0 }
})

afterAll(() => {
    global.Date.now = RealDate
})

test("save site record to db", async () => {
    const addSiteRecord = jest.fn(async () => {
        return "a fake record id"
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addSiteRecord
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const siteId = new ObjectId()
    const userId = new ObjectId()

    const response = await supertest(app)
        .post(`/v1/site/${siteId}/record`)
        .send({principle: 100, commission: 200})
        .set({id: `${userId}`})
    simpleCheckTKResponse(response, TKResponse.Success({
        data: {recordId: "a fake record id"}
    }))

    expect(addSiteRecord).toHaveBeenCalledWith({
        userId,
        siteId,
        kept: false,
        principle: 100,
        commission: 200,
        createdAt: now()
    })
})