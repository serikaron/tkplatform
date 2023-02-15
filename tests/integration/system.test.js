'use restrict'

import client from "./client.json" assert {type: "json"}
import {runTest} from "./api.mjs";


test.each`
url
${"/v1/system/sites"}
`("$url should live", async ({url}) => {
    await runTest({
        path: url,
        authentication: client
    })
})