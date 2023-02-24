'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {ObjectId} from "mongodb";

class Box {
    constructor() {
        this._firstUserSite = undefined
        this._secondUserSite = undefined
        this._site = undefined
    }

    set firstUserSite(s) {
        this._firstUserSite = s
    }

    get firstUserSite() {
        return this._firstUserSite
    }

    set secondUserSite(s) {
        this._secondUserSite = s
    }

    get secondUserSite() {
        return this._secondUserSite
    }

    set site(s) {
        this._site = s
    }

    get site() {
        return this._site
    }

    get emptyUserSite() {
        return {
            site: this.site,
            "credential": {
                "account": "",
                "password": ""
            },
            "verified": false,
            "account": {
                "list": []
            },
            "setting": {
                "interval": {
                    "min": 200,
                    "max": 300,
                },
                "schedule": [
                    {
                        "from": "",
                        "to": ""
                    },
                    {
                        "from": "",
                        "to": ""
                    },
                ]
            }
        }
    }
}

const baseURL = "http://localhost:9006"
const userId = `${new ObjectId()}`

describe.only("test site service", () => {
    const box = new Box()

    test("Get system sites", async () => {
        await runTest({
            method: "GET",
            path: "/v1/sites",
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data.length).toBeGreaterThan(0)
                box.site = response.data[0]
                console.log(box.site)
            }
        })
    })

    test("Get user sites", async () => {
        await runTest({
            method: "GET",
            path: "/v1/user/sites",
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data.length).toBe(0)
            }
        })
    })

    test("Add first site", async () => {
        await runTest({
            method: "POST",
            path: "/v1/user/site",
            body: {siteId: box.site.id},
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data.id).not.toBeUndefined()
                box.firstUserSite = response.data
                const actually = JSON.parse(JSON.stringify(response.data))
                delete actually.id
                expect(actually).toEqual(box.emptyUserSite)
            }
        })
    })

    test("Add second site", async () => {
        await runTest({
            method: "POST",
            path: "/v1/user/site",
            body: {siteId: box.site.id},
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data.id).not.toBeUndefined()
                box.secondUserSite = response.data
                const actually = JSON.parse(JSON.stringify(response.data))
                delete actually.id
                expect(actually).toEqual(box.emptyUserSite)
            }
        })
    })

    test("Set second site", async () => {
        const userSiteId = box.secondUserSite.id
        box.secondUserSite = {
            id: userSiteId,
            site: box.site,
            "credential": {
                "account": "12345",
                "password": "23456"
            },
            "verified": true,
            "account": {
                "list": [
                    "11111"
                ]
            },
            "setting": {
                "interval": {
                    "min": 200,
                    "max": 300,
                },
                "schedule": [
                    {
                        "from": "",
                        "to": ""
                    },
                    {
                        "from": "",
                        "to": ""
                    },
                ]
            }
        }

        await runTest({
            method: "PUT",
            path: `/v1/user/site/${userSiteId}`,
            body: box.secondUserSite,
            baseURL,
            userId,
            verify: response => {
                expect(response.status).toBe(200)
            }
        })
    })

    test("Check user sites", async () => {
        await runTest({
            method: "GET",
            path: "/v1/user/sites",
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data).toEqual([
                    box.firstUserSite, box.secondUserSite
                ])
            }
        })
    })
})