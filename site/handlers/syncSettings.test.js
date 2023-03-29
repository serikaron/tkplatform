'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const referenceSite = (siteId) => {
    return {
        site: {
            id: siteId
        },
        setting: {
            interval: {min: 200, max: 300},
            schedule: [
                {from: "01:00", to: "59:00", activated: true},
                {from: "02:00", to: "30:00", activated: false}
            ]
        },
    }
}

describe.each([
    {
        body: {interval: {sync: 1}},
        update: {"setting.interval": {min: 200, max: 300}},
    },
    {
        body: {schedule: [{sync: 1}]},
        update: {
            "setting.schedule.0.from": "01:00",
            "setting.schedule.0.to": "59:00",
            "setting.schedule.0.activated": true,
        },
    },
    {
        body: {schedule: [{sync: 2}, {sync: 1}]},
        update: {
            "setting.schedule.0.from": "01:00",
            "setting.schedule.0.to": "59:00",
            "setting.schedule.1.from": "02:00",
            "setting.schedule.1.to": "30:00",
            "setting.schedule.1.activated": false,
        }
    }
])
("each input ($#)", ({body, update}) => {
    test("update db correctly", async () => {
        const siteId = new ObjectId()
        const getUserSite = jest.fn(async () => {
            return referenceSite(siteId)
        })
        const syncSettings = jest.fn()

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            syncSettings,
                            getUserSite
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
            .put(`/v1/user/site/${userSiteId}/setting/sync`)
            .set({id: `${userId}`})
            .send(body)

        simpleCheckTKResponse(response, TKResponse.Success())
        expect(getUserSite).toHaveBeenCalledWith(`${userSiteId}`, `${userId}`)
        expect(syncSettings).toHaveBeenCalledWith(`${userId}`, siteId, update)
    })
})
