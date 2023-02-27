'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {ObjectId} from "mongodb";
import {mergeObjects} from "../../common/utils.mjs";

class Box {
    constructor() {
        this._data = {}
    }

    getEmptyUserSite() {
        return {
            site: this.data.site,
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

    get data() {
        return this._data
    }
}

const baseURL = "http://localhost:9006"

const checkUserSites = async (userId, desired) => {
    await runTest({
        method: "GET",
        path: "/v1/user/sites",
        baseURL,
        userId,
        verify: response => {
            simpleVerification(response)
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.data).toStrictEqual(desired)
        }
    })
}

const checkUserSite = async (userId, desired) => {
    await runTest({
        method: "GET",
        path: `/v1/user/site/${desired.id}`,
        baseURL,
        userId,
        verify: response => {
            simpleVerification(response)
            expect(response.data).toStrictEqual(desired)
        }
    })
}

const addUserSite = async (siteId, userId, userSite) => {
    await runTest({
        method: "POST",
        path: "/v1/user/site",
        body: {siteId},
        baseURL,
        userId,
        verify: response => {
            simpleVerification(response)
            expect(response.data.id).not.toBeUndefined()
            userSite.id = response.data.id
            expect(response.data).toStrictEqual(userSite)
        }
    })
}

const setUserSite = async (userSite, userId, update) => {
    await runTest({
        method: "PUT",
        path: `/v1/user/site/${userSite.id}`,
        body: update,
        baseURL,
        userId,
        verify: response => {
            expect(response.status).toBe(200)
            mergeObjects(userSite, update)
        }
    })
}

describe("test site service", () => {
    const box = new Box()
    const userId = `${new ObjectId()}`

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
                box.data.site = response.data[0]
            }
        })
    })

    test("Get user sites", async () => {
        await checkUserSites(userId, [])
    })

    test("Add first site", async () => {
        box.data.firstUserSite = box.getEmptyUserSite()
        await addUserSite(box.data.site.id, userId, box.data.firstUserSite);
    })

    test("Add second site", async () => {
        box.data.secondUserSite = box.getEmptyUserSite()
        await addUserSite(box.data.site.id, userId, box.data.secondUserSite);
    })

    test("Set second site", async () => {
        const userSiteId = box.data.secondUserSite.id
        const update = {
            id: userSiteId,
            site: box.data.site,
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

        await setUserSite(box.data.secondUserSite, userId, update)
    })

    test("Check user sites", async () => {
        await checkUserSites(userId, [box.data.firstUserSite, box.data.secondUserSite])
    })

    test("Update only one field", async () => {
        await setUserSite(box.data.firstUserSite, userId, {verified: true})
        await checkUserSites(userId, [box.data.firstUserSite, box.data.secondUserSite])
    })

    test("Update nested field", async () => {
        const update = {
            site: {
                alias: "alias-name"
            }
        }
        await setUserSite(box.data.firstUserSite, userId, update)
        await checkUserSite(userId, box.data.firstUserSite)
    })
})