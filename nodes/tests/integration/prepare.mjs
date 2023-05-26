'use strict'

import {runTest} from "./api.mjs";
import fs from 'fs/promises'

await runTest({
    path: '/v1/user/register',
    body: {
        phone: "13333333333",
        password: "123456",
        smsCode: "2065"
    },
    verify: async response => {
        const client = {
            phone: "13333333333",
            password: "123456",
            smsCode: "2065",
            captcha: "v53J",
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        }
        await fs.writeFile('./nodes/tests/integration/client.json', JSON.stringify(client, null, 4))
    }
})


