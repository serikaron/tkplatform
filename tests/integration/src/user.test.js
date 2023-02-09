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
        })
        await test({
            path: '/v1/user/login',
            body: {
                phone: "13333333333",
                password: "123456"
            },
        })
    })
})