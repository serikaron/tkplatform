'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test('return from db', async () => {
    const siteId = new ObjectId()
    const getUserSite = jest.fn(async () => {
        return TKResponse.Success({
            data: {
                site: {
                    id: `${siteId}`
                }
            }
        })
    })
    const getRecommend = jest.fn(async () => {
        return [
            {hour: 1, weight: 1},
            {hour: 3, weight: 3}
        ]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getRecommend
                    },
                    stubs: {
                        site: {
                            getUserSite
                        }
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userSiteId = new ObjectId()
    const userId = new ObjectId()
    const response = await supertest(app)
        .get(`/v1/site/${userSiteId}/recommend`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: [
            {hour: 0, weight: 0},
            {hour: 1, weight: 33},
            {hour: 2, weight: 0},
            {hour: 3, weight: 100},
            {hour: 4, weight: 0},
            {hour: 5, weight: 0},
            {hour: 6, weight: 0},
            {hour: 7, weight: 0},
            {hour: 8, weight: 0},
            {hour: 9, weight: 0},
            {hour: 10, weight: 0},
            {hour: 11, weight: 0},
            {hour: 12, weight: 0},
            {hour: 13, weight: 0},
            {hour: 14, weight: 0},
            {hour: 15, weight: 0},
            {hour: 16, weight: 0},
            {hour: 17, weight: 0},
            {hour: 18, weight: 0},
            {hour: 19, weight: 0},
            {hour: 20, weight: 0},
            {hour: 21, weight: 0},
            {hour: 22, weight: 0},
            {hour: 23, weight: 0},
        ]
    }))
    expect(getRecommend).toHaveBeenCalledWith(`${siteId}`)
    expect(getUserSite).toHaveBeenCalledWith(`${userId}`, `${userSiteId}`)
})