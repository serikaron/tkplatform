'use strict'

import argon2i from "argon2";
import {setup as setupServer} from '../server.mjs'
import createApp from "../../common/app.mjs";
import supertest from 'supertest'
import {makeMiddleware} from "../../common/flow.mjs";
import {parallelRun, serialTest} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals"
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {Response} from "../../common/response.mjs";

function todayTimestamp() {
    return Math.floor(new Date(new Date().toISOString().slice(0, 10).replaceAll("-", "/")).getTime() / 1000)
}

async function runTest(
    {
        body = {phone: "13333333333", password: "123456"},
        dbUsers = {},
        config = {daysForRegister: 7, daysForInvite: 3},
        verify = (req, res) => {
        },
        token = {status: 200, res: {code: 0, msg: "success"}},
        status, code, msg,
        data = {},
    }
) {
    const app = createApp()
    setupServer(app, {
        setup: testDIContainer.setup(makeMiddleware([
            (req, res) => {
                req.context = {
                    mongo: {
                        getUserByPhone: async (phone) => {
                            return phone in dbUsers ? dbUsers[phone] : null
                        },
                        getUserById: async (id) => {
                            return id in dbUsers ? dbUsers[id] : null
                        },
                        insertAndUpdate: jest.fn(),
                    },
                    stubs: {
                        token: {
                            gen: async (payload) => {
                                return new Response(token.status, token.res)
                            }
                        }
                    }
                }
            },
            (req, res) => {
                req.config = config
            }
        ])),
        teardown: testDIContainer.teardown(makeMiddleware([verify]))
    })

    const response = await supertest(app)
        .post('/v1/user/register')
        .send(body)
    if (response.status === 500 && response.body.code === 1) {
        throw new Error(response.body.msg)
        // console.log(response.body.msg)
        // expect(true).toBe(false)
    }
    expect(response.status).toBe(status)
    expect(response.body.code).toEqual(code)
    expect(response.body.msg).toEqual(msg)
    expect(response.body.data).toEqual(data)
}

describe("test register", () => {
    describe("invalid body", () => {
        const bodies = [
            {phone: "13333333333", inviter: {id: "13444444444"}},
            {password: "123456", inviter: {id: "13444444444"}},
            {phone: "13333333333", password: "123456", inviter: {}},
            {},
        ]
        it("should return InvalidArgument", async () => {
            await Promise.all(bodies.map(body => {
                return runTest({
                    body,
                    status: 400,
                    code: -1,
                    msg: "参数错误"
                })
            }))
        })
    })
    describe("phone already been registered", () => {
        const dbUsers = {
            "13333333333": {}
        }
        it("should return UserExists", async () => {
            await runTest({
                body: {phone: "13333333333", password: "123456"},
                dbUsers,
                status: 409,
                code: -10001,
                msg: "手机已注册"
            })
        })
    })
    describe("inviter can not be found", () => {
        it("should return UserNotExists", async () => {
            await runTest({
                body: {phone: "13333333333", password: "123456", inviter: {id: "abcde"}},
                status: 404,
                code: -10002,
                msg: "邀请人不存在"
            })
        })
    })
    describe("processing register logic", () => {
        it("should return encrypted password", async () => {
            await runTest({
                body: {phone: "13333333333", password: "123456"},
                verify: async (req) => {
                    expect(req.updateDB.registerUser.phone).toBe("13333333333")
                    expect(req.updateDB.registerUser.password === "123456").not.toBe(true)
                    const passwordMatched = await argon2i.verify(req.updateDB.registerUser.password, "123456")
                    expect(passwordMatched).toBe(true)
                },
                status: 201,
                code: 0,
                msg: "注册成功"
            })
        })
        describe("with difference configs", () => {
            const configs = [
                {daysForRegister: 7, daysForInvite: 3, expectUserExpiration: todayTimestamp() + 7 * 86400},
                {
                    daysForRegister: 7,
                    daysForInvite: 3,
                    expectUserExpiration: todayTimestamp() + 7 * 86400,
                    inviterExpiration: todayTimestamp(),
                    expectInviterExpiration: todayTimestamp() + 3 * 86400
                },
                {
                    daysForRegister: 6,
                    daysForInvite: 2,
                    expectUserExpiration: todayTimestamp() + 6 * 86400,
                    inviterExpiration: todayTimestamp() - 86400,
                    expectInviterExpiration: todayTimestamp() + 2 * 86400
                },
                {
                    daysForRegister: 5,
                    daysForInvite: 1,
                    expectUserExpiration: todayTimestamp() + 5 * 86400,
                    inviterExpiration: todayTimestamp() + 3 * 86400,
                    expectInviterExpiration: todayTimestamp() + 4 * 86400
                },
            ]
            it("should extend member expiration correctly", async () => {
                for (const config of configs) {
                    await runTest({
                        body: {
                            phone: "13333333333",
                            password: "123456",
                            inviter: config.inviterExpiration === undefined ? undefined : {
                                id: "13444444444",
                            },
                        },
                        dbUsers: config.inviterExpiration === undefined ? {} : {
                            "13444444444": {
                                id: "13444444444",
                                member: {
                                    expiration: config.inviterExpiration
                                }
                            }
                        },
                        config: {
                            daysForRegister: config.daysForRegister,
                            daysForInvite: config.daysForInvite
                        },
                        verify: (req) => {
                            expect(req.updateDB.registerUser.member.expiration).toBe(config.expectUserExpiration)
                            if (config.expectInviterExpiration === undefined) {
                                expect(req.updateDB.inviter).toBe(undefined)
                            } else {
                                expect(req.updateDB.inviter.member.expiration).toBe(config.expectInviterExpiration)
                            }
                        },
                        status: 201,
                        code: 0,
                        msg: "注册成功"
                    })
                }
            })
        })
        describe("has inviter or not", () => {
            const configurations = [
                {userPhone: "13333333333", expectUpLine: undefined},
                {
                    userPhone: "13333333333",
                    inviterPhone: "13444444444",
                    existsDownLines: [],
                    expectUpLine: "13444444444",
                    expectDownLines: ["13333333333"]
                },
                {
                    userPhone: "13333333333",
                    inviterPhone: "13444444444",
                    expectUpLine: "13444444444",
                    expectDownLines: ["13333333333"]
                },
                {
                    userPhone: "13333333333",
                    inviterPhone: "13444444444",
                    existsDownLines: ["13222222222"],
                    expectUpLine: "13444444444",
                    expectDownLines: ["13222222222", "13333333333"]
                }
            ]
            it("should set relationship correctly", async () => {
                await parallelRun(configurations, async (c) => {
                    await runTest({
                        body: {
                            phone: c.userPhone, password: "123456",
                            inviter: c.inviterPhone === undefined ? undefined : {
                                id: c.inviterPhone,
                            }
                        },
                        dbUsers: c.inviterPhone === undefined ? {} : {
                            [c.inviterPhone]: {
                                id: c.inviterPhone,
                                member: {expiration: todayTimestamp()},
                                downLines: c.existsDownLines
                            }
                        },
                        verify: (req) => {
                            expect(req.updateDB.registerUser.upLine).toBe(c.expectUpLine)
                            if (c.inviterPhone === undefined) {
                                expect(req.updateDB.inviter).toBe(undefined)
                            } else {
                                expect(req.updateDB.inviter.downLines).toStrictEqual(c.expectDownLines)
                            }
                        },
                        status: 201,
                        code: 0,
                        msg: "注册成功"
                    })
                })
            })
        })
    })
    describe("with various scenarios", () => {
        const scenarios = [
            {phone: "13333333333", password: "123456"},
            {phone: "13333333333", password: "123456", inviter: {id: "13444444444"}}
        ]
        it("should update db correctly", async () => {
            await serialTest(scenarios, async (s) => {
                await runTest({
                    body: s,
                    dbUsers: s.inviter === undefined ? {} : {
                        [s.inviter.id]: {
                            id: s.inviter.id,
                            member: {expiration: todayTimestamp()},
                        }
                    },
                    verify: (req) => {
                        if (s.inviter === undefined) {
                            expect(req.context.mongo.insertAndUpdate).toHaveBeenCalledWith({user: req.updateDB.registerUser})
                        } else {
                            expect(req.context.mongo.insertAndUpdate).toHaveBeenCalledWith({
                                user: req.updateDB.registerUser,
                                inviter: {
                                    filter: {_id: s.inviter.id},
                                    update: {
                                        $set: {
                                            member: req.updateDB.inviter.member,
                                            downLines: req.updateDB.inviter.downLines
                                        }
                                    }
                                }
                            })
                        }
                    },
                    status: 201,
                    code: 0,
                    msg: "注册成功"
                })
            })
        })
    })
    describe("when get token failed", () => {
        it("should also return a partial success", async () => {
            await runTest({
                token: {
                    status: 500, res: {
                        code: -20001,
                        msg: "error"
                    }
                },
                status: 201,
                code: -20001,
                msg: "注册成功，请重新登录"
            })
        })
    })
    test.concurrent.each([
        {body: {phone: "13333333333", password: "12345"}},
        {body: {phone: "13333333333", password: "12345", inviter: {id: "13444444444"}}},
    ])('(well done scenarios ($#) should return with token', async (scenarios) => {
        await runTest({
            body: scenarios.body,
            dbUsers: scenarios.body.inviter === undefined ? {} : {
                [scenarios.body.inviter.id]: {
                    _id: scenarios.body.inviter.id,
                    member: {expiration: todayTimestamp()}
                }
            },
            token: {
                status: 200,
                res: {
                    code: 0, msg: "success",
                    data: {
                        accessToken: "accessToken",
                        refreshToken: "refreshToken"
                    }
                },
            },
            status: 201,
            code: 0,
            msg: "注册成功",
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            }
        })
    })
})

