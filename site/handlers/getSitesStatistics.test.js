'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test('logic should correct', async () => {
    const userSiteId_1_1 = new ObjectId()
    const userSiteId_1_2 = new ObjectId()
    const userSiteId_2_1 = new ObjectId()
    const countSitesRecords = jest.fn(async () => {
        return TKResponse.Success({
            data: [
                {siteId: `${userSiteId_1_1}`, count: 1},
                {siteId: `${userSiteId_1_2}`, count: 2},
                {siteId: `${userSiteId_2_1}`, count: 3},
            ]
        })
    })

    const siteId1 = new ObjectId()
    const siteId2 = new ObjectId()
    const getSitesByUserSiteId = jest.fn(async () => {
        return [{site: {id: siteId1}}, {site: {id: siteId2}}]
    })
    const siteId3 = new ObjectId()
    const siteId4 = new ObjectId()
    const getSitesExcept = jest.fn(async () => {
        return [{site: {id: siteId3}}, {site: {id: siteId4}}]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    stubs: {
                        ledger: {
                            countSitesRecords
                        }
                    },
                    mongo: {
                        getSitesByUserSiteId,
                        getSitesExcept
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .get('/v1/sites/statistics')
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            success: 2,
            total: 4,
            notYetSites: [{id: `${siteId3}`}, {id: `${siteId4}`}]
        }
    }))
    expect(countSitesRecords).toHaveBeenCalledWith(`${userId}`)
    expect(getSitesByUserSiteId).toHaveBeenCalledWith([
        `${userSiteId_1_1}`, `${userSiteId_1_2}`, `${userSiteId_2_1}`
    ])
    expect(getSitesExcept).toHaveBeenCalledWith(`${userId}`, [siteId1, siteId2])
})