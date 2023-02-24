'use restrict'

import client from "./client.json" assert {type: "json"}
import {runTest} from "./api.mjs";
import {simpleVerification} from "./verification.mjs";

let firstSiteId = undefined
let secondSiteId = undefined

// no concurrent
test.each([
    {name: "Get system sites", method: "GET", path: "/v1/sites"},
    {name: "Get system sites with params", method: "GET", path: "/v1/sites?keyword=&offset=0&limit=10"},
    {name: "Get user sites", method: "GET", path: "/v1/user/sites"},
    {
        name: "Add first site",
        method: "POST", path: "/v1/user/site", body: {name: "site-name", icon: "site-icon"},
        verify: (response) => {
            simpleVerification(response)
            expect(response.data.id).not.toBe(undefined)
            firstSiteId = response.data.id
        }
    },
    {
        name: "Check first site",
        method: "GET", path: "/v1/user/sites",
        verify: (response => {
            simpleVerification(response)
            expect(response.data).toStrictEqual([
                {id: firstSiteId, name: "site-name", icon: "site-icon"}
            ])
        })
    },
    {
        name: "Add second site",
        method: "POST", path: "/v1/user/site", body: {name: "site-name", icon: "site-icon"},
        verify: (response) => {
            expect(response.data.id).not.toBe(undefined)
            secondSiteId = response.data.id
        }
    },
    {
        name: "Check user sites",
        method: "GET", path: "/v1/user/sites",
        verify: response => {
            expect(response.data).toStrictEqual([
                {id: firstSiteId, name: "site-name", icon: "site-icon"},
                {id: secondSiteId, name: "site-name", icon: "site-icon"}
            ])
        }
    },
    {
        name: "Set first site",
        method: "PUT", path: '/v1/user/site',
        body: {id: firstSiteId, name: "site-name-edited", icon: "site-icon-edited"},
        verify: response => {
            expect(response.status).toBe(200)
        }
    },
    {
        name: "Check user sites",
        method: "GET", path: "/v1/user/sites",
        verify: response => {
            expect(response.data).toStrictEqual([
                {id: firstSiteId, name: "site-name-edited", icon: "site-icon-edited"},
                {id: secondSiteId, name: "site-name", icon: "site-icon"}
            ])
        }
    },
    {
        name: "Set all sites",
        method: "PUT", path: '/v1/user/sites', body: [
            {id: firstSiteId, name: "site-name-first", icon: "site-icon-first"},
            {id: secondSiteId, name: "site-name-second", icon: "site-icon-second"}
        ],
        verify: response => {
            expect(response.status).toBe(200)
        }
    },
    {
        name: "Check user sites",
        method: "GET", path: "/v1/user/sites",
        verify: response => {
            expect(response.data).toStrictEqual([
                {id: firstSiteId, name: "site-name-first", icon: "site-icon-first"},
                {id: secondSiteId, name: "site-name-second", icon: "site-icon-second"}
            ])
        }
    },
])("$name ($path) should ok", async ({method, path, verify, body}) => {
    if (method === "PUT" && path === "/v1/user/site") {
        path = `${path}/${firstSiteId}`
        body.id = firstSiteId
    }
    if (method === "PUT" && path === "/v1/user/sites") {
        body[0].id = firstSiteId
        body[1].id = secondSiteId
    }
    await runTest({
        authentication: client,
        method,
        path,
        body,
        verify,
    })
})