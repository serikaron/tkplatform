'use strict'

import {setup as setupServer} from '../server.mjs'
import createApp from "../../common/app.mjs";
import supertest from 'supertest'
import {makeMiddleware} from "../../common/flow.mjs";
import {parallelRun, serialTest, simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals"
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

function todayTimestamp() {
    return Math.floor(new Date(new Date().toISOString().slice(0, 10).replaceAll("-", "/")).getTime() / 1000)
}

async function runTest(
    {
        body = {phone: "13333333333", password: "123456", smsCode: "1234"},
        dbUsers = {},
        config = {daysForRegister: 7, daysForInvite: 3},
        verify = () => {
        },
        insertAndUpdate = undefined,
        tokenFn = undefined,
        smsFn = async () => {
            return new TKResponse(200, {code: 0, msg: "success"})
        },
        encodeFn = async () => {
            return "encodedPassword"
        },
        status, code, msg,
        data = {},
    }
) {
    const app = createApp()
    setupServer(app, {
        setup: testDIContainer.setup(makeMiddleware([
            (req) => {
                req.context = {
                    mongo: {
                        getUserByPhone: async (find) => {
                            return find.phone in dbUsers ? dbUsers[find.phone] : null
                        },
                        getUserById: async (id) => {
                            return id in dbUsers ? dbUsers[id] : null
                        },
                        insertAndUpdate,
                    },
                    stubs: {
                        token: {
                            gen: tokenFn,
                        },
                        sms: {
                            verify: smsFn
                        }
                    },
                    password: {
                        encode: encodeFn
                    }
                }
            },
            (req) => {
                req.config = config
            }
        ])),
        teardown: testDIContainer.teardown(makeMiddleware([verify]))
    })

    const response = await supertest(app)
        .post('/v1/user/register')
        .send(body)
    simpleCheckResponse(response, status, code, msg, data)
}

describe("test register", () => {
    describe("invalid body", () => {
        const bodies = [
            {phone: "13333333333", inviter: {id: "13444444444"}},
            {password: "123456", inviter: {id: "13444444444"}},
            {phone: "13333333333", password: "123456", inviter: {}},
            {phone: "13333333333", password: "123456"},
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
                body: {phone: "13333333333", password: "123456", smsCode: "1234"},
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
                body: {phone: "13333333333", password: "123456", smsCode: "1234", inviter: {id: "abcde"}},
                status: 404,
                code: -10002,
                msg: "邀请人不存在"
            })
        })
    })
    test("invalid sms code should return error", async () => {
        const smsFn = jest.fn(async () => {
            return new TKResponse(400, {code: -1})
        })
        await runTest({
            body: {phone: "13333333333", password: "123456", smsCode: "1234"},
            smsFn,
            status: 400,
            code: -10006,
            msg: "验证码错误"
        })
        expect(smsFn).toHaveBeenCalledWith("13333333333", "1234")
    })
    describe("processing register logic", () => {
        it("should return encrypted password", async () => {
            const encodePassword = jest.fn(async () => {
                return "encodedPassword"
            })
            await runTest({
                body: {phone: "13333333333", password: "123456", smsCode: "1234"},
                insertAndUpdate: () => {
                },
                tokenFn: () => {
                    return new TKResponse(200, {code: 0})
                },
                verify: async (req) => {
                    expect(req.updateDB.registerUser.phone).toBe("13333333333")
                    expect(req.updateDB.registerUser.password).toBe("encodedPassword")
                    // expect(req.updateDB.registerUser.password === "123456").not.toBe(true)
                    // const passwordMatched = await argon2i.verify(req.updateDB.registerUser.password, "123456")
                    // expect(passwordMatched).toBe(true)
                },
                encodeFn: encodePassword,
                status: 201,
                code: 0,
                msg: "注册成功"
            })
            expect(encodePassword).toHaveBeenCalledWith("123456")
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
                            smsCode: "1234"
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
                        insertAndUpdate: () => {
                        },
                        tokenFn: () => {
                            return new TKResponse(200, {code: 0})
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
                            phone: c.userPhone, password: "123456", smsCode: "1234",
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
                        insertAndUpdate: () => {
                        },
                        tokenFn: () => {
                            return new TKResponse(200, {code: 0})
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
    test("update db failed should return RegisterError", async () => {
        await runTest({
            body: {phone: "13333333333", password: "123456", smsCode: "1234"},
            insertAndUpdate: async () => {
                return null
            },
            status: 500,
            code: -10005,
            msg: "注册失败"
        })
    })
    describe("with various scenarios", () => {
        const scenarios = [
            {phone: "13333333333", password: "123456", smsCode: "1234"},
            {phone: "13333333333", password: "123456", smsCode: "1234", inviter: {id: "13444444444"}}
        ]
        it("should update db correctly", async () => {
            const insertAndUpdate = jest.fn(() => {
                return "13333333333_user_id"
            })
            await serialTest(scenarios, async (s) => {
                await runTest({
                    body: s,
                    dbUsers: s.inviter === undefined ? {} : {
                        [s.inviter.id]: {
                            id: s.inviter.id,
                            member: {expiration: todayTimestamp()},
                        }
                    },
                    insertAndUpdate,
                    tokenFn: async () => {
                        return new TKResponse(200, {code: 0})
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
                insertAndUpdate: () => {
                },
                tokenFn: () => {
                    return new TKResponse(500, {
                        code: -20001,
                        msg: "error"
                    })
                },
                status: 201,
                code: -20001,
                msg: "注册成功，请重新登录"
            })
        })
    })
    test.concurrent.each([
        {body: {phone: "13333333333", password: "12345", smsCode: "1234"}},
        {body: {phone: "13333333333", password: "12345", smsCode: "1234", inviter: {id: "13444444444"}}},
    ])('(well done scenarios ($#) should return with token', async (scenarios) => {
        const tokenFn = jest.fn(() => {
            return new TKResponse(200, {
                code: 0, msg: "success", data: {
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                }
            })
        })
        await runTest({
            body: scenarios.body,
            dbUsers: scenarios.body.inviter === undefined ? {} : {
                [scenarios.body.inviter.id]: {
                    _id: scenarios.body.inviter.id,
                    member: {expiration: todayTimestamp()}
                }
            },
            insertAndUpdate: async () => {
                return "13333333333_user_id"
            },
            tokenFn,
            status: 201,
            code: 0,
            msg: "注册成功",
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            }
        })
        expect(tokenFn).toHaveBeenCalledWith({
            id: "13333333333_user_id",
            phone: "13333333333"
        })
    })
})

