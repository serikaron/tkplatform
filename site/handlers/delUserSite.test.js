'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("del site should be called", async () => {
    const delUserSite = jest.fn()

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        delUserSite
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
        .del(`/v1/user/site/${userSiteId}`)
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(delUserSite).toHaveBeenCalledWith(`${userSiteId}`, `${userId}`)
})