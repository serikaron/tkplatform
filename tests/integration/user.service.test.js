'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {now} from "../../common/utils.mjs";
import {genPhone} from "../common/utils.mjs";

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
                        open: true
                    }
                }
            })
        })

        describe("query others overview", () => {
            it("prepare another user", async () => {
                box.data.activeUserId = box.userId
                await register(genPhone(), box)
                box.data.passiveUserId = box.userId
            })
            it("update passive user", async () => {
                await update(box.data.passiveUserId, {name: "passive user"})
            })
            it("check passive user", async () => {
                await check(box.data.activeUserId, {
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
                                alias: x.alias === undefined ? "" : x.alias
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

        it("add two down lines", async () => {
            box.data.downLines = []
            for (let i = 0; i < 2; ++i) {
                const phone = genPhone()
                await register(phone, box, {id: box.data.inviter.id})
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
    })
})