'use restrict'

import client from "./client.json" assert {type: "json"}
import {runTest} from "./api.mjs";

// no concurrent
test.each([
    {name: "Get system sites", method: "GET", path: "/v1/sites"},
    {name: "Get system sites with params", method: "GET", path: "/v1/sites?keyword=&offset=0&limit=10"},
])("$name ($path) should ok", async ({method, path, verify, body}) => {
    await runTest({
        authentication: client,
        method,
        path,
        body,
        verify,
    })
})