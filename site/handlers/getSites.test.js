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
    {
        name: "normal query",
        query: {offset: 10, limit: 10, keyword: "abc"},
        dbArguments: {offset: 10, limit: 10, keyword: "abc"}
    },
    {
        name: "empty query",
        dbArguments: {offset: 0, limit: 50, keyword: null}
    },
])
("$name", ({query, dbArguments}) => {
    test("get sites for user", async () => {
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

        const url = query === undefined ? '/v1/sites' : `/v1/sites?${new URLSearchParams(query)}`
        const response = await supertest(app)
            .get(url)
        await simpleCheckTKResponse(response, TKResponse.Success({
            data: [{id: `${id}`, msg: "a fake sites data"}]
        }))
        expect(getSites).toHaveBeenCalledWith(dbArguments.offset, dbArguments.limit, dbArguments.keyword)
    })
})

describe.each([
    {
        name: "normal query",
        query: {offset: 10, limit: 10},
        dbArgs: {offset: 10, limit: 10}
    },
    {
        name: "empty query",
        dbArgs: {offset: 0, limit: 50}
    }
])
("$name", ({query, dbArgs}) => {
    test("get sites for backend", async () => {
        const id = new ObjectId()
        const getSitesForBackend = jest.fn(async () => {
            return [{_id: id, msg: "a fake sites data"}]
        })
        const countSitesForBackend = jest.fn(async () => {
            return 10
        })

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getSitesForBackend,
                            countSitesForBackend
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const url = query === undefined ? '/v1/backend/sites' : `/v1/backend/sites?${new URLSearchParams(query)}`
        const response = await supertest(app)
            .get(url)
        simpleCheckTKResponse(response, TKResponse.Success({
            data: {
                total: 10,
                offset: dbArgs.offset,
                limit: dbArgs.limit,
                items: [{id: id.toString(), msg: "a fake sites data"}]
            }
        }))
        expect(getSitesForBackend).toHaveBeenCalledWith(dbArgs.offset, dbArgs.limit)
        expect(countSitesForBackend).toHaveBeenCalled()
    })
})
