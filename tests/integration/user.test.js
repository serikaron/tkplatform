'use strict'

import {requireAuthenticatedClient, runTest} from "./api.mjs";

let authentication = {}

beforeAll(async () => {
    authentication = await requireAuthenticatedClient("13444444444")
})

describe('register and login', () => {
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
            newPassword: authentication.password,
            smsCode: authentication.smsCode
        },
        authentication: authentication,
        verify: (response) => {
            expect(response.status).toBe(200)
            authentication.accessToken = response.data.accessToken
        }
    })
    await runTest({
        path: "/v1/user/account",
        body: {
            old: {
                phone: authentication.phone,
                password: authentication.password
            },
            new: {
                phone: authentication.phone,
                password: authentication.password
            },
            smsCode: authentication.smsCode
        },
        authentication: authentication,
    })
})