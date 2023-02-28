'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {now} from "../../common/utils.mjs";

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

function genPhone() {
    const prefix = ['130', '131', '132', '133', '135', '136', '137', '138', '139', '147', '150', '151', '152', '153', '155', '156', '157', '158', '159', '186', '187', '188', '198'];
    const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    const randomSuffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `${randomPrefix}${randomSuffix}`
}

const register = async (phone, box) => {
    await runTest({
        baseURL,
        method: "POST",
        path: "/v1/user/register",
        body: {
            phone,
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

    describe.only("test user overview", () => {
        const box = new Box()
        const phone = genPhone()
        it("prepare user", async () => {
            await register(phone, box)
        })

        it("update", async () => {
            await runTest({
                method: "PUT",
                path: "/v1/user/overview",
                body: {
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
                },
                baseURL,
                userId: box.userId,
                verify: response => {
                    expect(response.status).toBe(200)
                }
            })
        })

        it("check", async () => {
            await runTest({
                method: "GET",
                path: "/v1/user/overview",
                baseURL,
                userId: box.userId,
                verify: response => {
                    simpleVerification(response)
                    expect(response.data).toStrictEqual({
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
                }
            })
        })
    })
})