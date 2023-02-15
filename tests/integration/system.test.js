'use restrict'

import {requireAuthenticatedClient, runTest} from "./api.mjs";

let authentication = {}

beforeAll(async () => {
    authentication = await requireAuthenticatedClient("13000009005")
})

test.each`
url
${"/v1/system/sites"}
`("$url should live", async ({url}) => {
    await runTest({
        path: url,
        authentication: authentication
    })
})