"use restrict"

import createApp from "../../common/app.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from '@jest/globals'
import {TKResponse} from "../../common/TKResponse.mjs";
import {setup} from "../setup.mjs";
import {ObjectId} from "mongodb";

describe.each([
    {path: '/v1/sites', filter: {usingDisable: 1}},
    {path: '/v1/backend/sites', filter: {}}
])
("$path", ({path, filter}) => {
    it("should get from db and return", async () => {
        const id = new ObjectId()
        const getSites = jest.fn(async () => {
            return [{_id: id, msg: "a fake sites data"}]
        })
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getSites: getSites,
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .get(path)
        await simpleCheckTKResponse(response, TKResponse.Success({
            data: [{id: `${id}`, msg: "a fake sites data"}]
        }))
        expect(getSites).toHaveBeenCalledWith(filter)
    })
})
