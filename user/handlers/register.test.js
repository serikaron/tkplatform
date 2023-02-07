'use strict'

import {register} from "./register.mjs";

function todayTimestamp() {
    return Math.floor(new Date(new Date().toISOString().slice(0, 10).replaceAll("-", "/")).getTime() / 1000)
}

describe('register', () => {
    describe("without inviter", () => {
        it("should only add member to register user", () => {
            const result = register({
                registerUser: {
                    phone: "13333333333",
                    password: "123456"
                },
                config: {
                    daysForRegister: 6,
                    daysForInvite: 3,
                }
            })
            expect(result.registerUser).toStrictEqual({
                phone: "13333333333",
                password: "123456",
                member: {
                    expiration: todayTimestamp() + 6 * 86400,
                }
            })
        })
    })

    describe("with inviter", () => {
        describe("member expired", () => {
            it("extend member from now", () => {
                const result = register({
                    registerUser: {
                        phone: "13333333333", password: "123456"
                    }, inviter: {
                        phone: "13444444444", member: {expiration: todayTimestamp()}
                    }, config: {
                        daysForRegister: 7, daysForInvite: 2
                    }
                })
                expect(result).toStrictEqual({
                    registerUser: {
                        phone: "13333333333", password: "123456",
                        member: {expiration: todayTimestamp() + 7 * 86400}
                    },
                    inviter: {
                        phone: "13444444444", member: {expiration: todayTimestamp() + 2 * 86400}
                    }
                })
            })
        })
        describe("member not expired", () => {
            it("extend member from expiration", () => {
                const result = register({
                    registerUser: {
                        phone: "13333333333", password: "123456",
                    },
                    inviter: {
                        phone: "13444444444", member: {expiration: todayTimestamp() + 86400}
                    },
                    config: {
                        daysForRegister: 7, daysForInvite: 3
                    }
                })
                expect(result).toStrictEqual({
                    registerUser: {
                        phone: "13333333333", password: "123456",
                        member: {expiration: todayTimestamp() + 7 * 86400}
                    }, inviter: {
                        phone: "13444444444", member: {expiration: todayTimestamp() + 4 * 86400}
                    }
                })
            })
        })
    })
})