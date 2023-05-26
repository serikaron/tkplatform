'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test('get from db', async () => {
    const getMissing = jest.fn(async () => {
        return [
            {missing: {name: "site-name"}, operate: {status: 1, comment: "comment", thumb: true}}
        ]
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getMissing
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .get('/v1/missing/sites')
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            total: 1,
            list: [{
                name: "site-name",
                status: 1,
                comment: "comment",
                thumb: true
            }]
        }
    }))
    expect(getMissing).toHaveBeenCalledWith(`${userId}`)
})