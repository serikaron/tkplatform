'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {now} from "../../common/utils.mjs";
import {genPhone} from "../common/utils.mjs";
import {ObjectId} from "mongodb";

dotenv.config()

const baseURL = "http://localhost:9001"

class Box {
    constructor() {
        this._id = undefined
        this._data = {}
    }

    get userId() {
        return this._id
    }

    set userId(id) {
        this._id = id
    }

    get data() {
        return this._data
    }
}

const register = async (phone, box, inviter) => {
    await runTest({
        baseURL,
        method: "POST",
        path: "/v1/user/register",
        body: {
            phone,
            inviter,
            password: "123456",
            smsCode: "2065",
            qq: "1234567890"
        },
        verify: response => {
            expect(response.status).toBe(201)
            expect(response.data.accessToken).toBeDefined()
            const payload = jwt.verify(response.data.accessToken, process.env.SECRET_KEY, {
                ignoreExpiration: true,
                algorithm: "HS256"
            })
            box.userId = payload.id
        }
    })
}

const login = async (phone, password, expectOK) => {
    await runTest({
        method: "POST",
        path: "/v1/user/login",
        body: {phone, password},
        baseURL,
        verify: response => {
            const expectStatus = expectOK ? 200 : 403
            expect(response.status).toBe(expectStatus)
        }
    })
}

describe("test user service", () => {
    describe("test get member", () => {
        const box = new Box()
        const phone = genPhone()
        test("add user", async () => {
            await register(phone, box)
        })

        test("get member", async () => {
            await runTest({
                baseURL,
                method: "GET",
                path: "/v1/user/member",
                userId: box.userId,
                verify: response => {
                    simpleVerification(response)
                    expect(response.data.expiration).toBeDefined()
                    expect(response.data.expiration).toEqual(now() + 86400 * 7)
                }
            })
        })
    })

    describe("test user overview", () => {
        const update = async (userId, body) => {
            await runTest({
                method: "PUT",
                path: "/v1/user/overview",
                body,
                baseURL,
                userId,
                verify: response => {
                    expect(response.status).toBe(200)
                }
            })
        }

        const check = async (userId, desired, toCheckId) => {
            const query = toCheckId === undefined ? "" : `?id=${toCheckId}`
            await runTest({
                method: "GET",
                path: `/v1/user/overview${query}`,
                baseURL,
                userId,
                verify: response => {
                    simpleVerification(response)
                    for (let i = 0; i < response.data.length; ++i) {
                        expect(response.data[i].registeredAt).toBeGreaterThanOrEqual(desired[i].registeredAt)
                        expect(response.data[i].member.expiration).toBeGreaterThanOrEqual(desired[i].member.expiration)
                        delete response.data[i].registeredAt
                        delete response.data[i].member.expiration
                        delete desired[i].registeredAt
                        delete desired[i].member.expiration
                    }
                    expect(response.data).toStrictEqual(desired)
                }
            })
        }

        const box = new Box()
        const phone = genPhone()
        it("prepare user", async () => {
            await register(phone, box)
        })

        it("update", async () => {
            await update(box.userId, {
                name: "edited name",
                contact: {
                    qq: {
                        account: "11111111",
                        open: true,
                    },
                    wechat: {
                        account: "2222222",
                        open: true,
                    },
                    phone: {
                        open: true,
                    }
                }
            })
        })

        it("check", async () => {
            await check(box.userId, {
                phone,
                name: "edited name",
                registeredAt: now(),
                activeDays: {
                    "30": 0,
                    total: 0,
                },
                rechargeCount: 0,
                member: {
                    expiration: now() + 7 * 86400
                },
                siteCount: 0,
                sites: [],
                contact: {
                    qq: {
                        account: "11111111",
                        open: true,
                    },
                    wechat: {
                        account: "2222222",
                        open: true,
                    },
                    phone: {
                        account: phone,
                        open: true
                    }
                }
            })
        })

        describe("query others overview", () => {
            const anotherPhone = genPhone()
            it("prepare another user", async () => {
                box.data.activeUserId = box.userId
                await register(anotherPhone, box)
                box.data.passiveUserId = box.userId
            })
            it("update passive user", async () => {
                await update(box.data.passiveUserId, {name: "passive user"})
            })
            it("check passive user", async () => {
                await check(box.data.activeUserId, {
                    phone: anotherPhone,
                    name: "passive user",
                    registeredAt: now(),
                    activeDays: {
                        "30": 0,
                        total: 0,
                    },
                    rechargeCount: 0,
                    member: {
                        expiration: now() + 7 * 86400
                    },
                    sites: [],
                    siteCount: 0,
                    contact: {
                        qq: {
                            account: "1234567890",
                            open: false,
                        },
                        wechat: {
                            account: "",
                            open: false,
                        },
                        phone: {
                            account: anotherPhone,
                            open: false
                        }
                    }
                }, box.data.passiveUserId)
            })
        })
    })

    describe("test downLines", () => {
        const box = new Box()
        const check = async () => {
            await runTest({
                method: "GET",
                path: "/v1/user/downLines",
                baseURL,
                userId: box.data.inviter.id,
                verify: response => {
                    simpleVerification(response)
                    expect(response.data.total).toBe(box.data.downLines.length)
                    expect(response.data.withdraw).toBe(0)
                    response.data.items.forEach(x => {
                        expect(x.registeredAt).toBeGreaterThan(now() - 10)
                        expect(x.registeredAt).toBeLessThanOrEqual(now())
                        delete x.registeredAt
                        expect(x.member.expiration).toBeGreaterThan(now() + 7 * 86400 - 10)
                        expect(x.member.expiration).toBeLessThanOrEqual(now() + 7 * 86400)
                        delete x.member.expiration
                    })
                    expect(response.data.items).toStrictEqual(
                        box.data.downLines.map(x => {
                            return {
                                id: x.id,
                                phone: x.phone,
                                lastLoginAt: 0,
                                // registeredAt: now(),
                                member: {
                                    // expiration: now() + 7 * 86400
                                },
                                name: "",
                                alias: x.alias === undefined ? "" : x.alias,
                                claimed: x.claimed === undefined ? false : x.claimed
                            }
                        })
                    )
                }
            })
        }

        it("register inviter", async () => {
            await register(genPhone(), box)
            box.data.inviter = {id: box.userId}
        })

        it("empty down lines should work perfectly", async () => {
            box.data.downLines = []
            await check()
        })

        it("add two down lines", async () => {
            const inviterId = () => {
                return box.data.inviter.id
                    .substring(box.data.inviter.id.length - 8)
            }
            box.data.downLines = []
            for (let i = 0; i < 2; ++i) {
                const phone = genPhone()
                await register(phone, box, {id: inviterId()})
                box.data.downLines.push({
                    id: box.userId,
                    phone
                })
            }
        })

        it("check", async () => {
            await check()
        })

        it("set alias", async () => {
            await runTest({
                method: "PUT",
                path: `/v1/user/downLine/${box.data.downLines[0].id}`,
                body: {alias: "alias"},
                baseURL,
                userId: box.data.inviter.id,
                verify: response => {
                    expect(response.status).toBe(200)
                    box.data.downLines[0].alias = "alias"
                }
            })
        })

        it("check after update", async () => {
            await check()
        })

        it("claim first downLine", async () => {
            await runTest({
                method: "POST",
                path: `/v1/user/downLine/${box.data.downLines[0].id}/claim`,
                baseURL,
                userId: box.data.inviter.id,
                verify: rsp => {
                    expect(rsp.status).toBe(200)
                    box.data.downLines[0].claimed = true
                }
            })
            await check()
        })
    })

    describe("test reset password", () => {
        const reset = async (config) => {
            await runTest({
                method: "POST",
                path: "/v1/user/password",
                body: {
                    smsCode: "2065",
                    newPassword: config.newPassword,
                    oldPassword: config.oldPassword,
                    phone: config.phone
                },
                baseURL,
                userId: config.userId,
                verify: response => {
                    expect(response.status).toBe(200)
                }
            })
        }

        it("should be ok", async () => {
            const box = new Box()
            const phone = genPhone()
            await register(phone, box)
            await login(phone, "123456", true)
            await reset({
                newPassword: "2222",
                oldPassword: "123456",
                userId: box.userId
            })
            await login(phone, "2222", true)
            await login(phone, "123456", false)
            await reset({
                newPassword: "3333",
                phone: phone
            })
            await login(phone, "3333", true)
            await login(phone, "2222", false)
        })
    })

    describe("test reset account", () => {
        const reset = async (body, userId) => {
            await runTest({
                method: "POST",
                path: '/v1/user/account',
                body,
                baseURL,
                userId,
                verify: response => {
                    expect(response.status).toBe(200)
                }
            })
        }

        it("should be ok", async () => {
            const box = new Box()
            box.data.phone1 = genPhone()
            await register(box.data.phone1, box)
            await login(box.data.phone1, "123456", true)

            box.data.phone2 = genPhone()
            await reset({
                old: {smsCode: "2065"},
                new: {phone: box.data.phone2, smsCode: "2065"}
            }, box.userId)
            await login(box.data.phone1, "123456", false)
            await login(box.data.phone2, "123456", true)

            box.data.phone3 = genPhone()
            await reset({
                old: {phone: box.data.phone2, password: "123456"},
                new: {phone: box.data.phone3, smsCode: "2065"}
            }, undefined)
            await login(box.data.phone2, "123456", false)
            await login(box.data.phone3, "123456", true)
        })
    })

    describe("test user centre", () => {
        const box = new Box()
        const phone = genPhone()

        it("should be ok", async () => {
            await register(phone, box)

            await runTest({
                method: "GET",
                path: '/v1/user/centre',
                baseURL,
                userId: box.userId,
                verify: rsp => {
                    simpleVerification(rsp)
                    expect(rsp.data).toStrictEqual(
                        {
                            id: box.userId.substring(box.userId.length - 8),
                            phone,
                            member: {
                                expiration: now() + 7 * 86400
                            },
                            identified: false,
                            notice: [],
                            wallet: {
                                cash: 0,
                                rice: 0
                            }
                        }
                    )
                }
            })
        })
    })

    describe("test backend", () => {
        test("register", async () => {
            await runTest({
                method: "POST",
                path: "/v1/backend/register",
                body: {username: "abc", password: "123"},
                baseURL,
                verify: rsp => {
                    expect(rsp.status).toBe(200)
                }
            })
        })

        test("login", async () => {
            await runTest({
                method: "POST",
                path: "/v1/backend/login",
                body: {username: "abc", password: "123"},
                baseURL,
                verify: rsp => {
                    expect(rsp.status).toBe(200)
                }
            })
        })
    })

    describe("test report", () => {
        const userId = `${new ObjectId()}`
        test("report types", async () => {
            await runTest({
                method: "GET",
                path: '/v1/report/types',
                baseURL,
                userId,
                verify: simpleVerification
            })
        })

        const addReport = async (report) => {
            await runTest({
                method: "POST",
                path: '/v1/user/report',
                body: report,
                baseURL,
                userId,
                verify: rsp => {
                    simpleVerification(rsp)
                    report.id = rsp.data.id
                }
            })
        }

        const reports = []
        test("add", async () => {
            for (let i = 0; i < 2; ++i) {
                const report = {
                    msg: `report body ${i}`
                }
                await addReport(report)
                reports.push(report)
            }
        })

        test("get all", async () => {
            await runTest({
                method: "GET",
                path: '/v1/user/reports',
                baseURL,
                userId,
                verify: rsp => {
                    simpleVerification(rsp)
                    rsp.data.forEach(x => {
                        expect(x.reportedAt).toBeGreaterThanOrEqual(now() - 1)
                    })
                    rsp.data.forEach(x => delete x.reportedAt)
                    expect(rsp.data).toStrictEqual(reports)
                }
            })
        })

        test("get one", async () => {
            await runTest({
                method: "GET",
                path: `/v1/user/report/${reports[0].id}`,
                baseURL,
                userId,
                verify: rsp => {
                    simpleVerification(rsp)
                    expect(rsp.data.reportedAt).toBeGreaterThanOrEqual(now() - 1)
                    delete rsp.data.reportedAt
                    expect(rsp.data).toEqual(reports[0])
                }
            })
        })
    })

    describe("test message", () => {
        const userId = new ObjectId().toString()

        const addMessage = async () => {
            let id = undefined
            await runTest({
                method: "POST",
                path: '/v1/user/message',
                body: {userId},
                baseURL,
                userId,
                verify: rsp => {
                    simpleVerification(rsp)
                    id = rsp.data.id
                }
            })
            return id
        }

        const getMessages = async () => {
            let out = undefined
            await runTest({
                method: "GET",
                path: '/v1/user/messages',
                baseURL,
                userId,
                verify: rsp => {
                    simpleVerification(rsp)
                    out = rsp.data
                }
            })
            return out
        }

        const sortMessages = (a, b) => {
            if (a.id < b.id) return -1
            if (a.id > b.id) return 1
            return 0
        }

        describe("test", () => {

            const check = async (messages) => {
                const r = await getMessages()
                r.items.sort(sortMessages)
                r.items.forEach(x => delete x.createdAt)
                expect(r).toStrictEqual({
                    total: messages.length,
                    items: messages
                })
            }

            const messages = []

            test("prepare message", async () => {
                for (let i = 0; i < 5; ++i) {
                    const id = await addMessage()
                    messages.push({
                        id, userId,
                        read: false,
                    })
                }

                messages.sort(sortMessages)

                await check(messages)
            })

            test("read one message", async () => {
                await runTest({
                    method: "PUT",
                    path: `/v1/user/message/${messages[2].id}`,
                    body: {read: true},
                    baseURL,
                    userId,
                    verify: rsp => {
                        expect(rsp.status).toBe(200)
                        messages[2].read = true
                    }
                })

                await check(messages)
            })

            test("delete read message (one)", async () => {
                await runTest({
                    method: "DELETE",
                    path: `/v1/user/messages`,
                    baseURL,
                    userId,
                    verify: rsp => {
                        expect(rsp.status).toBe(200)
                        messages.splice(2, 1)
                    }
                })

                await check(messages)
            })

            test('delete by id', async () => {
                await runTest({
                    method: "DELETE",
                    path: `/v1/user/message/${messages[1].id}`,
                    baseURL,
                    userId,
                    verify: rsp => {
                        expect(rsp.status).toBe(200)
                        messages.splice(1, 1)
                    }
                })

                await check(messages)
            })

            test("read all and delete", async () => {
                await runTest({
                    method: "PUT",
                    path: '/v1/user/messages',
                    body: {read: true},
                    baseURL,
                    userId,
                    verify: rsp => {
                        expect(rsp.status).toBe(200)
                        messages.forEach(x => x.read = true)
                    }
                })

                await check(messages)

                await runTest({
                    method: "DELETE",
                    path: '/v1/user/messages',
                    baseURL,
                    userId,
                    verify: rsp => {
                        expect(rsp.status).toBe(200)
                        messages.splice(0, messages.length)
                    }
                })

                await check(messages)
            })
        })
    })
})