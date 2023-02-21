'use restrict'

import client from "./client.json" assert {type: "json"}
import {runTest} from "./api.mjs";
import {simpleVerification} from "./verification.mjs";

test.each([
    {path: "/v1/stores"},
    {path: "/v1/ledger/accounts"}
])("$path should live", async ({path}) => {
    await runTest(
        {
            authentication: client,
            method: "GET",
            path,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data.length).toBeGreaterThan(0)
            }
        }
    )
})