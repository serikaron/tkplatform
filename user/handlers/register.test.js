'use strict'

import {setup as setupServer} from '../server.mjs'
import createApp from "../../common/app.mjs";
import supertest from 'supertest'
import {makeMiddleware} from "../../common/flow.mjs";
import {simpleCheckResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals"
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";
import {copy} from "../../common/utils.mjs";

const RealDate = Date.now
const mockNow = () => {
    return 0
}

beforeAll(() => {
    // global.Date.now = () => { return 1677571421 }
    global.Date.now = mockNow
})

afterAll(() => {
    global.Date.now = RealDate
})

async function runTest(
    {
        body = {phone: "13333333333", password: "123456", smsCode: "1234"},
        getUserByPhone = async () => {
            return null
        },
        systemFn = async () => {
            return TKResponse.Success({
                data: {
                    daysForRegister: 7,
                    daysForInvite: 3,
                }
            })
        },
        tokenFn = async () => {
            return TKResponse.Success({
                data: {
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                }
            })
        },
        smsFn = async () => {
            return TKResponse.Success()
        },
        encodeFn = async () => {
            return "encodedPassword"
        },
        register = async () => {
            return new ObjectId()
        },
        updateInviter = async () => {
            return true
        },
        getInviter = async (id) => {
            return {
                _id: new ObjectId(id),
                member: {
                    expiration: mockNow()
                }
            }
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
                        getUserByPhone,
                        register,
                        updateInviter,
                        getInviter,
                    },
                    stubs: {
                        token: {
                            gen: tokenFn,
                        },
                        sms: {
                            verify: smsFn
                        },
                        system: {
                            settings: {
                                get: systemFn
                            }
                        },
                    },
                    password: {
                        encode: encodeFn
                    }
                }
            },
        ])),
        teardown: testDIContainer.teardown(makeMiddleware([]))
    })

    const response = await supertest(app)
        .post('/v1/user/register')
        .send(body)
    simpleCheckResponse(response, status, code, msg, data)
}

describe("test register", () => {
    describe.each([
        {phone: "13333333333", inviter: {id: "13444444444"}},
        {password: "123456", inviter: {id: "13444444444"}},
        {phone: "13333333333", password: "123456", inviter: {}},
        {phone: "13333333333", password: "123456"},
        {},
        {
            "inviter": {"phone": "14711111111"},
            "password": "111111",
            "phone": "18938901487",
            "qq": "2KIP",
            "smsCode": "3059"
        },
    ])("($#) invalid body", (body) => {
        it.concurrent("should return InvalidArgument", async () => {
            await runTest({
                body,
                status: 400,
                code: -1,
                msg: "参数错误"
            })
        })
    })

    test("phone already been registered should return UserExists", async () => {
        const getUserByPhone = jest.fn(async () => {
            return {
                phone: "13333333333"
            }
        })
        await runTest({
            body: {phone: "13333333333", password: "123456", smsCode: "1234"},
            getUserByPhone,
            status: 409,
            code: -10001,
            msg: "手机已注册"
        })
        expect(getUserByPhone).toHaveBeenCalledWith({phone: "13333333333"}, {_id: 1})
    })

    describe("inviter can not be found", () => {
        it("should return UserNotExists", async () => {
            await runTest({
                body: {phone: "13333333333", password: "123456", smsCode: "1234", inviter: {id: "abcde"}},
                getInviter: async () => {
                    return null
                },
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

    describe("when get token failed", () => {
        it("should also return a partial success", async () => {
            await runTest({
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

    test('all well done should return with token', async () => {
        const tokenFn = jest.fn(async () => {
            return new TKResponse(200, {
                code: 0, msg: "success", data: {
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                }
            })
        })
        const registerId = new ObjectId()
        await runTest({
            body: {phone: "13333333333", password: "12345", smsCode: "1234", inviter: {id: `${new ObjectId()}`}},
            tokenFn,
            register: async () => {
                return registerId
            },
            status: 201,
            code: 0,
            msg: "注册成功",
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken"
            }
        })
        expect(tokenFn).toHaveBeenCalledWith({
            id: `${registerId}`,
            phone: "13333333333"
        })
    })

    describe("update db", () => {
        describe.each([
            {
                register: async () => {
                    return null
                },
                updateInviter: async () => {
                    return true
                }
            },
            {
                register: async () => {
                    return new ObjectId()
                },
                updateInviter: async () => {
                    return false
                }
            }
        ])("($#) when failed", ({register, updateInviter}) => {
            it("should return RegisterError", async () => {
                await runTest({
                    body: {
                        phone: "13333333333",
                        password: "123456",
                        smsCode: "1234",
                        inviter: {id: `${new ObjectId()}`}
                    },
                    register,
                    updateInviter,
                    status: 500,
                    code: -10005,
                    msg: "注册失败"
                })
            })
        })

        it("full user information check", async () => {
            const register = jest.fn(async () => {
                return new ObjectId()
            })
            await runTest({
                body: {
                    phone: "13333333333",
                    password: "123456",
                    smsCode: "1234",
                    qq: "1234567890",
                },
                register,
                tokenFn: () => {
                    return new TKResponse(200, {code: 0})
                },
                status: 201,
                code: 0,
                msg: "注册成功"
            })
            expect(register).toHaveBeenCalledWith({
                phone: "13333333333",
                password: "encodedPassword",
                member: {
                    expiration: mockNow() + 7 * 86400
                },
                registeredAt: mockNow(),
                contact: {
                    qq: {
                        account: "1234567890",
                        open: false
                    },
                    wechat: {
                        account: "",
                        open: false
                    },
                    phone: {
                        open: false
                    }
                },
                name: "",
            })
        })

        describe("test relationship", () => {
            const registerId = new ObjectId()
            const inviterId = new ObjectId()
            const existDownLineId = new ObjectId()
            describe.each([
                {},
                {
                    inviter: {id: `${inviterId}`},
                    existsDownLines: [],
                    expectUpLine: inviterId,
                    expectDownLines: [{id: registerId}]
                },
                {
                    inviter: {id: `${inviterId}`},
                    expectUpLine: inviterId,
                    expectDownLines: [{id: registerId}]
                },
                {
                    inviter: {id: `${inviterId}`},
                    existsDownLines: [{id: existDownLineId}],
                    expectUpLine: inviterId,
                    expectDownLines: [{id: existDownLineId}, {id: registerId}]
                }
            ])("($#) with inviter or not", (relationship) => {
                describe.each([
                    // {daysForRegister: 7, daysForInvite: 3, expectUserExpiration: mockNow() + 7 * 86400},
                    {
                        daysForRegister: 7,
                        daysForInvite: 3,
                        expectUserExpiration: mockNow() + 7 * 86400,
                        inviterExpiration: mockNow(),
                        expectInviterExpiration: mockNow() + 3 * 86400
                    },
                    {
                        daysForRegister: 6,
                        daysForInvite: 2,
                        expectUserExpiration: mockNow() + 6 * 86400,
                        inviterExpiration: mockNow() - 86400,
                        expectInviterExpiration: mockNow() + 2 * 86400
                    },
                    {
                        daysForRegister: 5,
                        daysForInvite: 1,
                        expectUserExpiration: mockNow() + 5 * 86400,
                        inviterExpiration: mockNow() + 3 * 86400,
                        expectInviterExpiration: mockNow() + 4 * 86400
                    },
                ])("($#) with prize setting", (prize) => {
                    it("all should be correct", async () => {
                        const getInviter = jest.fn(async (id) => {
                            console.log(`exists: ${JSON.stringify(relationship.existsDownLines)}`)
                            return {
                                _id: new ObjectId(id),
                                downLines: copy(relationship.existsDownLines),
                                member: {
                                    expiration: prize.inviterExpiration
                                }
                            }
                        })
                        const register = jest.fn(async () => {
                            return registerId
                        })
                        const updateInviter = jest.fn(async () => {
                            return true
                        })
                        const systemFn = jest.fn(async () => {
                            return TKResponse.Success({
                                data: {
                                    daysForRegister: prize.daysForRegister,
                                    daysForInvite: prize.daysForInvite
                                }
                            })
                        })
                        await runTest({
                            body: copy({
                                phone: "13333333333", password: "123456", smsCode: "1234",
                                inviter: relationship.inviter,
                            }),
                            getInviter,
                            updateInviter,
                            register,
                            systemFn,
                            tokenFn: () => {
                                return new TKResponse(200, {code: 0})
                            },
                            status: 201,
                            code: 0,
                            msg: "注册成功"
                        })
                        expect(register).toHaveBeenCalledWith({
                            phone: "13333333333",
                            password: "encodedPassword",
                            member: {
                                expiration: prize.expectUserExpiration
                            },
                            registeredAt: mockNow(),
                            contact: {
                                qq: {account: "", open: false},
                                wechat: {account: "", open: false},
                                phone: {open: false}
                            },
                            name: "",
                            upLine: relationship.expectUpLine
                        })
                        if (relationship.inviter !== undefined) {
                            expect(getInviter).toHaveBeenCalledWith(`${inviterId}`)
                            console.log(`expect ${JSON.stringify(relationship.expectDownLines)}`)
                            expect(updateInviter).toHaveBeenCalledWith(inviterId, {
                                downLines: relationship.expectDownLines,
                                "member.expiration": prize.expectInviterExpiration
                            })
                        }
                    })
                })
            })
        })

    })
})

