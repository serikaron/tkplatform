'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("add journal entry to user site", async () => {
    const entryId = new ObjectId()
    const addUserSiteJournalEntry = jest.fn(async () => {
        return entryId
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addUserSiteJournalEntry
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
        .post(`/v1/user/site/${userSiteId}/journal/entry`)
        .send({
            msg: "user site journal entry"
        })
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {entryId: `${entryId}`}
    }))
    expect(addUserSiteJournalEntry).toHaveBeenCalledWith(`${userId}`, `${userSiteId}`, {
        msg: "user site journal entry"
    })
})
