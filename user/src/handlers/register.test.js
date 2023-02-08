'use strict'

import {register} from "./register.mjs";
import argon2i from "argon2";

function todayTimestamp() {
    return Math.floor(new Date(new Date().toISOString().slice(0, 10).replaceAll("-", "/")).getTime() / 1000)
}

describe('register', () => {
    it("should return encrypted password", async () => {
        const result = await register({
            registerUser: {
                phone: "13333333333", password: "123456"
            },
            config: {
                daysForRegister: 7, daysForInvite: 3
            }
        })
        expect(result.registerUser.phone).toBe("13333333333")
        expect(result.registerUser.password === "123456").toBe(false)
        const passwordMatched = await argon2i.verify(result.registerUser.password, "123456")
        expect(passwordMatched).toBe(true)
    })
    it("should extend member expiration correctly", async () => {
        const test = async ({
                                inviterExpiration = undefined,
                                daysForRegister,
                                daysForInvite,
                                expectUserExpiration,
                                expectInviterExpiration
                            }) => {
            const result = await register({
                registerUser: {
                    phone: "13333333333", password: "123456"
                },
                inviter: inviterExpiration === undefined ? undefined :
                    {
                        phone: "13444444444",
                        member: {
                            expiration: inviterExpiration
                        }
                    },
                config: {
                    daysForRegister, daysForInvite
                }
            })
            expect(result.registerUser.member.expiration).toBe(expectUserExpiration)
            if (expectInviterExpiration === undefined) {
                expect(result.inviter).toBe(undefined)
            } else {
                expect(result.inviter.member.expiration).toBe(expectInviterExpiration)
            }
        }
        await Promise.all([
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
                .map(test)
        )
    })
    it("should set relationship correctly", async () => {
        const test = async ({userPhone, inviterPhone, existsDownLines, expectUpLine, expectDownLines}) => {
            const result = await register({
                registerUser: {
                    phone: userPhone, password: "123456"
                },
                inviter: inviterPhone === undefined ? undefined :
                    {
                        phone: inviterPhone,
                        member: {expiration: todayTimestamp()},
                        downLines: existsDownLines
                    },
                config: {daysForRegister: 7, daysForInvite: 3}
            })
            expect(result.registerUser.upLine).toBe(expectUpLine)
            if (inviterPhone === undefined) {
                expect(result.inviter).toBe(undefined)
            } else {
                expect(result.inviter.downLines).toStrictEqual(expectDownLines)
            }
        }
        await Promise.all([
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
                existsDownLines: ["13222222222"],
                expectUpLine: "13444444444",
                expectDownLines: ["13222222222", "13333333333"]
            }
        ].map(test))
    })
})