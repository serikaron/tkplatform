"use restrict"

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {NotFound} from "../../common/errors/00000-basic.mjs";

test("return 404 when not found", async () => {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserSite: async () => {
                            return null
                        }
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get("/v1/user/site/fake-site-id")
        .set({id: "a fake user id"})

    simpleCheckTKResponse(response, TKResponse.fromError(new NotFound()))
})

test("get site from db", async () => {
    const getUserSite = jest.fn(async () => {
        return {
            _id: "a fake site id",
            userId: "a fake user id",
            msg: "a fake site"
        }
    })
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserSite,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get("/v1/user/site/fake-site-id")
        .set({id: "a fake user id"})
    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            id: "a fake site id",
            msg: "a fake site"
        }
    }))
    expect(getUserSite).toHaveBeenCalledWith("fake-site-id", "a fake user id")
})