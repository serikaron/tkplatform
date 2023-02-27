"use restrict"

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import {now} from "../../common/utils.mjs";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {
        query: "?offset=1&limit=10",
        offset: 1,
        limit: 10
    },
    {
        query: "",
        offset: 0,
        limit: 50
    }
])("($#) scenario", ({query, offset, limit}) => {
    it("should get entries from db", async () => {
        const entryId = new ObjectId()
        const userId = new ObjectId()
        const userSiteId = new ObjectId()
        const getUserSiteJournalEntries = jest.fn(async () => {
            return {
                total: 10,
                items: [{
                    _id: entryId,
                    createdAt: now(),
                    userId,
                    userSiteId,
                    msg: "a fake entry"
                }]
            }
        })

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getUserSiteJournalEntries
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .get(`/v1/user/site/${userSiteId}/journal/entries${query}`)
            .set({id: `${userId}`})

        simpleCheckTKResponse(response, TKResponse.Success({
            data: {
                total: 10,
                items: [{
                    id: `${entryId}`,
                    userSiteId: `${userSiteId}`,
                    msg: "a fake entry"
                }]
            }
        }))
        expect(getUserSiteJournalEntries).toHaveBeenCalledWith(`${userId}`, `${userSiteId}`, offset, limit)
    })
})
