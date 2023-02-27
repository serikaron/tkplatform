'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";

describe.each([
    {
        body: {balance: 100},
        update: {balance: 100},
        tkResponse: TKResponse.Success()
    },
    {
        body: {balance: 100, extraField: "should be ignore"},
        update: {balance: 100},
        tkResponse: TKResponse.Success()
    },
    {
        body: {illegal: "illegal body"},
        tkResponse: TKResponse.fromError(new InvalidArgument())
    },
    {
        body: {balance: "100"},
        tkResponse: TKResponse.fromError(new InvalidArgument())
    }
])("($#) scenario", ({body, update, tkResponse}) => {
    it.concurrent("should run as expected", async () => {
        const setUserSiteBalance = jest.fn()

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            setUserSiteBalance
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const userSiteId = new ObjectId()
        const userid = new ObjectId()
        const response = await supertest(app)
            .put(`/v1/user/site/${userSiteId}/balance`)
            .send(body)
            .set({id: `${userid}`})

        simpleCheckTKResponse(response, tkResponse)
        if (update !== undefined) {
            expect(setUserSiteBalance).toHaveBeenCalledWith(`${userSiteId}`, `${userid}`, update)
        }
    })
})
