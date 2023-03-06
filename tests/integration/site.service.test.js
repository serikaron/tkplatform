'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {ObjectId} from "mongodb";
import {copy, mergeObjects, now} from "../../common/utils.mjs";

class Box {
    constructor() {
        this._data = {}
    }

    getEmptyUserSite() {
        return {
            site: copy(this.data.site),
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
                        "to": "",
                        activated: false
                    },
                    {
                        "from": "",
                        "to": "",
                        activated: false
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

const getSites = async (userId, box) => {
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
            box.data.sites = response.data
        }
    })
}

const delSite = async (userId, userSiteId) => {
    await runTest({
        method: "DELETE",
        path: `/v1/user/site/${userSiteId}`,
        baseURL,
        userId,
        verify: response => {
            expect(response.status).toBe(200)
        }
    })
}

const addEntry = async (userId, userSiteId, entry) => {
    await runTest({
        method: "POST",
        path: `/v1/user/site/${userSiteId}/journal/entry`,
        body: entry,
        baseURL,
        userId,
        verify: response => {
            simpleVerification(response)
            expect(response.data.entryId).not.toBeUndefined()
            entry.id = response.data.entryId
        }
    })
}

const checkEntries = async (userId, userSiteId, offset, limit, desired) => {
    await runTest({
        method: "GET",
        path: `/v1/user/site/${userSiteId}/journal/entries`,
        query: {offset, limit},
        baseURL,
        userId,
        verify: response => {
            simpleVerification(response)
            expect(response.data).toStrictEqual(desired)
        }
    })
}

describe("test site service", () => {
    describe("test access user site", () => {
        const box = new Box()
        const userId = `${new ObjectId()}`
        test("Get system sites", async () => {
            await getSites(userId, box)
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

        test("Del user site", async () => {
            await delSite(userId, box.data.firstUserSite.id)
            await checkUserSites(userId, [box.data.secondUserSite])
            await runTest({
                method: "GET",
                path: `/v1/user/site/${box.data.firstUserSite.id}`,
                baseURL,
                userId,
                verify: response => {
                    expect(response.status).toBe(404)
                }
            })
        })
    })

    describe("test user site balance", () => {
        const box = new Box()
        const userId = `${new ObjectId()}`

        const siteBalanceOf = userSite => {
            return {
                id: userSite.id,
                site: userSite.site,
                balance: userSite.balance === undefined ? 0 : userSite.balance
            }
        }

        it("prepare two sites for user", async () => {
            await getSites(userId, box)

            box.data.userSite1 = box.getEmptyUserSite()
            await addUserSite(box.data.site.id, userId, box.data.userSite1)

            box.data.userSite2 = box.getEmptyUserSite()
            box.data.userSite2.site = box.data.sites[1]
            await addUserSite(box.data.sites[1].id, userId, box.data.userSite2)
        })

        it("verify one site", async () => {
            await setUserSite(box.data.userSite1, userId, {verified: true})
        })

        it("should get balance of verified site", async () => {
            await runTest({
                method: "GET",
                path: "/v1/user/sites/balance",
                baseURL,
                userId,
                verify: response => {
                    simpleVerification(response)
                    expect(Array.isArray(response.data)).toBe(true)
                    expect(response.data).toStrictEqual([siteBalanceOf(box.data.userSite1)])
                }
            })
        })

        describe("should update balance correctly", () => {
            it("update", async () => {
                await runTest({
                    method: "PUT",
                    path: `/v1/user/site/${box.data.userSite1.id}/balance`,
                    body: {balance: 100},
                    baseURL,
                    userId,
                    verify: response => {
                        expect(response.status).toBe(200)
                        box.data.userSite1.balance = 100
                    }
                })
            })
            it("check", async () => {
                await runTest({
                    method: "GET",
                    path: `/v1/user/sites/balance`,
                    baseURL,
                    userId,
                    verify: response => {
                        simpleVerification(response)
                        expect(Array.isArray(response.data)).toBe(true)
                        expect(response.data).toStrictEqual([siteBalanceOf(box.data.userSite1)])
                    }
                })
            })
        })
    })

    describe("test user site journal entries", () => {
        const box = new Box()
        const userId = `${new ObjectId()}`

        it("prepare", async () => {
            await getSites(userId, box)
            box.data.userSite = box.getEmptyUserSite()
            await addUserSite(box.data.site.id, userId, box.data.userSite)
            await setUserSite(box.data.userSite, userId, {verified: true})
        })

        it("add entries", async () => {
            box.data.entry1 = {
                userSiteId: box.data.userSite.id,
                name: "taskName",
                account: "account",
                withdrewAt: now(),
                amount: 100
            }
            await addEntry(userId, box.data.userSite.id, box.data.entry1)

            box.data.entry2 = {
                userSiteId: box.data.userSite.id,
                name: "taskName2",
                account: "account2",
                withdrewAt: now() + 10,
                amount: 110
            }
            await addEntry(userId, box.data.userSite.id, box.data.entry2)
        })

        it("query with offset limit", async () => {
            await checkEntries(userId, box.data.userSite.id, 0, 1, {total: 2, items: [box.data.entry2]})
            await checkEntries(userId, box.data.userSite.id, 1, 1, {total: 2, items: [box.data.entry1]})
        })

        describe("can get this month entries", () => {
            it("add expired entry", async () => {
                box.data.expiredEntry = {
                    userSiteId: box.data.userSite.id,
                    name: "expiredName",
                    account: "expriedAccount",
                    withdrewAt: now() - 86400 * 30 - 100,
                    amount: 120
                }
                await addEntry(userId, box.data.userSite.id, box.data.expiredEntry)
            })
            it("check", async () => {
                await checkEntries(userId, box.data.userSite.id, null, null, {
                    total: 2,
                    items: [box.data.entry2, box.data.entry1]
                })
            })
        })
    })

    describe("test count user sites", () => {
        const box = new Box()
        const userId = `${new ObjectId()}`

        it("prepare 2 sites", async () => {
            await getSites(userId, box)

            box.data.userSite1 = box.getEmptyUserSite()
            await addUserSite(box.data.sites[0].id, userId, box.data.userSite1)
            box.data.userSite2 = box.getEmptyUserSite()
            box.data.userSite2.site = box.data.sites[1]
            await addUserSite(box.data.sites[1].id, userId, box.data.userSite2)
        })

        it("count", async () => {
            await runTest({
                method: "GET",
                path: "/v1/user/sites/count",
                baseURL,
                userId,
                verify: response => {
                    simpleVerification(response)
                    expect(response.data.count).toBe(2)
                }
            })
        })
    })
})
