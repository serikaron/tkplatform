'use restrict'

import {jest} from "@jest/globals";
import {ObjectId} from "mongodb";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test("get downlines", async () => {
    const downLineIds = [
        new ObjectId(),
        new ObjectId(),
    ]
    const getDownLines = jest.fn(async () => {
        return downLineIds.map(id => {
            return {id}
        })
    })
    const getDownLineInfo = jest.fn(async () => {
        return {
            phone: "13333333333",
            registeredAt: 100,
            member: {
                expiration: 200
            },
            name: "",
        }
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getDownLines,
                        getDownLineInfo
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .get('/v1/user/downLines')
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            withdraw: 0,
            total: 2,
            items: downLineIds.map(id => {
                return {
                    id: `${id}`,
                    phone: "13333333333",
                    registeredAt: 100,
                    member: {
                        expiration: 200,
                    },
                    name: "",
                    alias: "",
                    lastLoginAt: 0,
                }
            })
        }
    }))
    expect(getDownLines).toHaveBeenCalledWith(`${userId}`)
    expect(getDownLineInfo).toHaveBeenNthCalledWith(1, downLineIds[0])
    expect(getDownLineInfo).toHaveBeenNthCalledWith(2, downLineIds[1])
})

describe.each([
    {downLines: undefined},
    {downLines: null},
    {downLines: []}
])
("bad down line ($#)", ({downLines}) => {
    it("should handle correctly", async () => {
        const getDownLines = jest.fn(async () => {
            return downLines
        })

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getDownLines,
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const userId = new ObjectId()
        const response = await supertest(app)
            .get('/v1/user/downLines')
            .set({id: `${userId}`})

        simpleCheckTKResponse(response, TKResponse.Success({
            data: {
                withdraw: 0,
                total: 0,
                items: []
            }
        }))
        expect(getDownLines).toHaveBeenCalledWith(`${userId}`)
    })
})
