'use restrict'

import {test} from "./api.mjs";

it("sms service should live", async () => {
    await test({
        path: '/v1/sms/send',
        body: {
            phone: "13333333333",
            captcha: "xxxx"
        },
        verify: (response) => {
            expect(response.status).toBe(200)
        }
    })
})