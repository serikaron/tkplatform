'use restrict'

import {test} from "./api.mjs";

it("sms service should live", async () => {
    await test({
        path: '/v1/sms/send',
        body: {
            phone: "13333333333",
            captcha: "v53J"
        },
        verify: (response) => {
            expect(response.status).toBe(500)
            expect(response.code).toBe(-30002)
            expect(response.msg).toBe("发送短信失败")
        }
    })
})