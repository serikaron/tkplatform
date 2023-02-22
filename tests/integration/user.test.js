'use strict'

import {runTest} from "./api.mjs";
import {simpleVerification} from "./verification.mjs";

describe('user test about auth', () => {
    let accessToken = undefined
    const phone = "13444444444"

    test("first register", async () => {
        await runTest({
            path: '/v1/user/register',
            body: {
                phone: phone,
                password: "123456",
                smsCode: "2065"
            },
            verify: response => {
                expect(response.status).toBe(201)
            }
        })
    })

    test("second login", async () => {
        await runTest({
            path: '/v1/user/login',
            body: {
                phone: phone,
                password: "123456"
            },
            verify: response => {
                simpleVerification(response)
                accessToken = response.data.accessToken
            }
        })
    })

    test("and then change password", async () => {
        await runTest({
            path: "/v1/user/password",
            body: {
                phone: phone,
                newPassword: "123456",
                smsCode: "2065",
            },
            // authentication: {accessToken},
            verify: (response) => {
                // simpleVerification(response)
                expect(response.status).toBe(200)
                expect(response.code).toBe(0)
            }
        })
    })

    // test("last change account", async () => {
    //     await runTest({
    //         path: "/v1/user/account",
    //         body: {
    //             old: {
    //                 phone: phone,
    //                 password: "123456",
    //             },
    //             new: {
    //                 phone: phone,
    //                 password: "123456",
    //             },
    //             smsCode: "2065",
    //         },
    //         // authentication: {accessToken}
    //     })
    // })
})