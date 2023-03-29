'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {jest} from "@jest/globals";
import {now} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";
import dotenv from "dotenv";

dotenv.config()

describe.each([
    // filter with site
    {userSiteId: `${new ObjectId()}`},
    // all
    {}
])("with siteId: $siteId", ({userSiteId}) => {
    test("get site record from db", async () => {
        const minDate = now() - 86400
        const maxDate = now()
        const getSiteRecords = jest.fn(async () => {
            return [{
                _id: "a fake record id",
                msg: "a fake site record"
            }]
        })
        const countSiteRecords = jest.fn(async () => {
            return 100
        })
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getSiteRecords,
                            countSiteRecords
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .get(`/v1/site/records/${minDate}/${maxDate}`)
            .query({userSiteId})
            .set({id: "a fake user id"})
        simpleCheckTKResponse(response, TKResponse.Success({
            data: {
                total: 100,
                rate: 1000,
                list: [{
                    id: "a fake record id",
                    msg: "a fake site record"
                }]
            }
        }))
        expect(getSiteRecords).toHaveBeenCalledWith("a fake user id", userSiteId, minDate, maxDate)
        expect(countSiteRecords).toHaveBeenCalledWith("a fake user id", userSiteId, minDate, maxDate)
    })
})