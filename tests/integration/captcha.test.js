'use restrict'

import {test} from "./api.mjs";

it("captcha service should work", async () => {
    await test({
        path: '/v1/captcha/require',
        body: {
            phone: "13333333333"
        }
    })
})