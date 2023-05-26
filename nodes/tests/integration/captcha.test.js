'use restrict'

import {runTest} from "./api.mjs";

it("captcha service should work", async () => {
    await runTest({
        path: '/v1/captcha/require',
        body: {}
    })
})