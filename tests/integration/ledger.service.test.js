'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {now, today} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

const baseURL = "http://localhost:9007"
const userId = "60f6a4b4f4b2384f8c40b1ac"

class Box {
    constructor() {
        this._entryId = undefined
        this._keptAt = undefined
        this._createdAt = undefined
        this._data = undefined
    }

    get entryId() {
        return this._entryId
    }

    set entryId(id) {
        this._entryId = id
    }

    get keptAt() {
        return this._keptAt
    }

    set keptAt(time) {
        this._keptAt = time
    }

    get createdAt() {
        return this._createdAt
    }

    set createdAt(time) {
        this._createdAt = time
    }

    get data() {
        return this._data
    }

    set data(d) {
        this._data = d
    }
}

describe("test ledger entries db", () => {
    const box = new Box()
    test("add entry", async () => {
        await runTest({
            method: "POST",
            path: "/v1/ledger/entry",
            body: {msg: "a test ledger entry"},
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data.entryId).not.toBe(undefined)
                box.entryId = response.data.entryId
            }
        })
    })

    test("check entry after add", async () => {
        await runTest({
            method: "GET",
            path: "/v1/ledger/entries",
            query: {
                minDate: today(),
                maxDate: today() + 86400,
            },
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                const entries = response.data
                    .filter(entry => entry.id === box.entryId)
                expect(entries.length).toBeGreaterThan(0)
                entries
                    .forEach(entry => {
                        expect(entry.id).toBe(box.entryId)
                        expect(entry.userId).toBe(userId)
                        expect(entry.msg).toBe("a test ledger entry")
                        expect(entry.createdAt).not.toBe(undefined)
                        box.createdAt = entry.createdAt
                    })
            }
        })
    })

    test("update entry", async () => {
        await runTest({
            method: "PUT",
            path: `/v1/ledger/entry/${box.entryId}`,
            body: {msg: "a new test body"},
            baseURL,
            userId,
            verify: response => {
                expect(response.status).toBe(200)
            }
        })
    })

    test("check entry after updating", async () => {
        await runTest({
            method: "GET",
            path: "/v1/ledger/entries",
            query: {
                minDate: today(),
                maxDate: today() + 86400,
            },
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                const entries = response.data
                    .filter(entry => entry.id === box.entryId)
                expect(entries.length).toBe(1)
                entries
                    .forEach(entry => {
                        expect(entry.id).toBe(box.entryId)
                        expect(entry.userId).toBe(userId)
                        expect(entry.msg).toBe("a new test body")
                        expect(entry.createdAt).toBe(box.createdAt)
                        expect(entry.keptAt).not.toBeUndefined()
                        box.keptAt = entry.keptAt
                    })
            }
        })
    })

    test("update entry the second time", async () => {
        await runTest({
            method: "PUT",
            path: `/v1/ledger/entry/${box.entryId}`,
            body: {msg: "a new new test body"},
            baseURL,
            userId,
            verify: response => {
                expect(response.status).toBe(200)
            }
        })
    })

    test("check entry after updating the second time", async () => {
        await runTest({
            method: "GET",
            path: "/v1/ledger/entries",
            query: {
                minDate: today(),
                maxDate: today() + 86400,
            },
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                const entries = response.data
                    .filter(entry => entry.id === box.entryId)
                expect(entries.length).toBe(1)
                entries
                    .forEach(entry => {
                        expect(entry.id).toBe(box.entryId)
                        expect(entry.userId).toBe(userId)
                        expect(entry.msg).toBe("a new new test body")
                        expect(entry.createdAt).toBe(box.createdAt)
                        expect(entry.keptAt).toBe(box.keptAt)
                    })
            }
        })
    })
})

describe("test journal entries db", () => {
    const box = new Box()

    test("add entry", async () => {
        await runTest({
            method: "POST",
            path: "/v1/journal/entry",
            body: {msg: "a journal entry"},
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data.entryId).not.toBe(undefined)
                box.entryId = response.data.entryId
            }
        })
    })

    test("check after adding", async () => {
        await runTest({
            method: "GET",
            path: "/v1/journal/entries",
            query: {minDate: today(), maxDate: today() + 86400},
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                const entries = response.data.filter(entry => entry.id === box.entryId)
                expect(entries.length).toBe(1)
                entries.forEach(entry => {
                    expect(entry.id).toBe(box.entryId)
                    expect(entry.userId).toBe(userId)
                    expect(entry.msg).toBe("a journal entry")
                    expect(entry.createdAt).not.toBeUndefined()
                    box.createdAt = entry.createdAt
                })
            }
        })
    })

    test("update entry", async () => {
        await runTest({
            method: "PUT",
            path: `/v1/journal/entry/${box.entryId}`,
            body: {msg: "a new entry body"},
            baseURL,
            userId,
            verify: response => {
                expect(response.status).toBe(200)
            }
        })
    })

    test("check after updating", async () => {
        await runTest({
            method: "GET",
            path: "/v1/journal/entries",
            query: {minDate: today(), maxDate: today() + 86400},
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                const entries = response.data.filter(entry => entry.id === box.entryId)
                expect(entries.length).toBe(1)
                entries.forEach(entry => {
                    expect(entry.id).toBe(box.entryId)
                    expect(entry.userId).toBe(userId)
                    expect(entry.msg).toBe("a new entry body")
                    expect(entry.createdAt).toBe(box.createdAt)
                })
            }
        })
    })
})

describe("test site record", () => {
    const box = new Box()
    box.data = {
        siteId1: `${new ObjectId()}`,
        userId1: `${new ObjectId()}`,
        siteId2: `${new ObjectId()}`,
        userId2: `${new ObjectId()}`,
    }

    // beforeAll(async () => {
    //     const ledger = await integrationConnectMongo("ledger", 10003)
    //     const r = await ledger.db.collection("siteRecords")
    //         .insertMany([{
    //             userId: new ObjectId(userId),
    //             siteId: new ObjectId(siteId),
    //             createdAt: now() - 2 * 86400,
    //             kept: false
    //         }, {
    //             userId: new ObjectId(userId),
    //             siteId: new ObjectId(),
    //             createdAt: now(),
    //             kept: false
    //         }, {
    //             userId: new ObjectId(),
    //             siteId: new ObjectId(siteId),
    //             createdAt: now(),
    //             kept: false
    //         }])
    //     box.data = {
    //         ids: Object.values(r.insertedIds).map(x => `${x}`)
    //     }
    // })

    test("add site record", async () => {
        await runTest({
            method: "POST",
            path: `/v1/site/${box.data.siteId1}/record`,
            body: {principle: 100, commission: 200},
            baseURL,
            userId: box.data.userId1,
            verify: response => {
                simpleVerification(response)
                expect(response.data.recordId).not.toBeUndefined()
                box.data.id1 = response.data.recordId
            }
        })
    })

    test("get site record", async () => {
        await runTest({
            method: "GET",
            path: `/v1/site/records/${now() - 86400}/${now() + 100}`,
            query: {siteId: box.data.siteId1},
            baseURL,
            userId: box.data.userId1,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data.length).toBe(1)
                const record = response.data[0]
                expect(record.createdAt).toBeLessThanOrEqual(now())
                expect(record.id).toBe(box.data.id1)
                expect(record.kept).toBe(false)
                expect(record.principle).toBe(100)
                expect(record.commission).toBe(200)
            }
        })
    })

    test("set site record", async () => {
        await runTest({
            method: "PUT",
            path: `/v1/site/${box.data.siteId1}/record/${box.data.id1}`,
            body: {kept: 1},
            baseURL,
            userId: box.data.userId1,
            verify: response => {
                expect(response.status).toBe(200)
            }
        })
    })

    test("check record to be correctly updated", async () => {
        await runTest({
            method: "GET",
            path: `/v1/site/records/${now() - 86400}/${now() + 100}`,
            query: {siteId: box.data.siteId1},
            baseURL,
            userId: box.data.userId1,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data.length).toBe(1)
                const record = response.data[0]
                expect(record.id).toBe(box.data.id1)
                expect(record.kept).toBe(true)
                expect(record.createdAt).toBeLessThanOrEqual(now())
                expect(record.principle).toBe(100)
                expect(record.commission).toBe(200)
            }
        })
    })

    test("check search without siteId", async () => {
        await runTest({
            method: "POST",
            path: `/v1/site/${box.data.siteId2}/record`,
            body: {principle: 100, commission: 200},
            baseURL,
            userId: box.data.userId1,
            verify: response => {
                simpleVerification(response)
                expect(response.data.recordId).not.toBeUndefined()
                box.data.id2 = response.data.recordId
            }
        })
        await runTest({
            method: "GET",
            path: `/v1/site/records/${now() - 86400}/${now() + 100}`,
            baseURL,
            userId: box.data.userId1,
            verify: response => {
                simpleVerification(response)
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data.length).toBe(2)
                // check id only
                const ids = response.data.map(x => x.id)
                expect(ids.includes(box.data.id1)).toBe(true)
                expect(ids.includes(box.data.id2)).toBe(true)
            }
        })
    })

    // test("check search with timestamp", async () => {
    //     await runTest({
    //         method: "POST",
    //         path: `/v1/site/${box.data.siteId1}/record`,
    //         body: {principle: 100, commission: 200},
    //         baseURL,
    //         userId: box.data.userId2,
    //         verify: response => {
    //             simpleVerification(response)
    //             expect(response.data.recordId).not.toBeUndefined()
    //             box.data.id3 = response.data.recordId
    //         }
    //     })
    // })
})