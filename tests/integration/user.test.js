'use strict'

import client from './client.json' assert {type: "json"}
import {runTest} from "./api.mjs";

describe.skip('register and login', () => {
    it("should return ok", async () => {
        await runTest({
            path: '/v1/user/register',
            body: {
                phone: "13333333333",
                password: "123456",
                smsCode: "2065"
            },
            verify: response => {
                expect(response.status).toBe(201)
            }
        })
        await runTest({
            path: '/v1/user/login',
            body: {
                phone: "13333333333",
                password: "123456"
            },
        })
    })
})

test("user change password", async () => {
    await runTest({
        path: "/v1/user/password",
        body: {
            newPassword: client.password,
            smsCode: client.smsCode
        },
        authentication: client,
        verify: (response) => {
            expect(response.status).toBe(200)
            client.accessToken = response.data.accessToken
        }
    })
    await runTest({
        path: "/v1/user/account",
        body: {
            old: {
                phone: client.phone,
                password: client.password
            },
            new: {
                phone: client.phone,
                password: client.password
            },
            smsCode: client.smsCode
        },
        authentication: client,
    })
})