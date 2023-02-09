'use strict'

import {test} from "./api.mjs";

describe('register and login', () => {
    it("should return ok", async () => {
        await test({
            path: '/v1/user/register',
            body: {
                phone: "13333333333",
                password: "123456"
            },
            verify: (response) => {
                if (response.code !== 0) {
                    console.log(response.toString())
                }
                expect(response.status).toBe(200)
                expect(response.code).toBe(0)
            }
        })
        await test({
            path: '/v1/user/login',
            body: {
                phone: "13333333333",
                password: "123456"
            },
            verify: (response) => {
                if (response.code !== 0) {
                    console.log(response.toString())
                }
                expect(response.status).toBe(200)
                expect(response.code).toBe(0)
            }
        })
    })
})