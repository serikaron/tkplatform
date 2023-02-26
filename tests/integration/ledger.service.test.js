'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {now, today} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

const baseURL = "http://localhost:9007"

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

class Box1 {
    constructor() {
        this._data = {}
    }

    get data() {
        return this._data
    }

    newEntry() {
        return {
            account: "entryAccount",
            comment: "entryComment",
            createdAt: now()
        }
    }
}

const addEntry = async (key, entry, userId) => {
    await runTest({
        method: "POST",
        path: `/v1/${key}/entry`,
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

async function checkEntries(key, userId, query, desired) {
    await runTest({
        method: "GET",
        path: `/v1/${key}/entries/${today()}/${today() + 86400}`,
        query: query,
        baseURL,
        userId: userId,
        verify: response => {
            simpleVerification(response)
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.data).toStrictEqual(desired)
        }
    })
}

async function checkEntry(key, userId, entryId, desired) {
    await runTest({
        method: "GET",
        path: `/v1/${key}/entry/${entryId}`,
        baseURL,
        userId,
        verify: response => {
            simpleVerification(response)
            expect(response.data).toStrictEqual(desired)
        }
    })
}

async function updateEntry(key, entry, userId, update) {
    await runTest({
        method: "PUT",
        path: `/v1/${key}/entry/${entry.id}`,
        body: update,
        baseURL,
        userId,
        verify: response => {
            expect(response.status).toBe(200)
            Object.keys(update).forEach(key => {
                entry[key] = update[key]
            })
        }
    })
}

describe.each([
    "ledger",
    "journal"
])("%s", (key) => {
    describe("test entries db", () => {
        describe("modify entry", () => {
            const box = new Box1()
            box.data.userId = `${new ObjectId()}`

            test("add entry", async () => {
                box.data.entry1 = box.newEntry()
                await addEntry(key, box.data.entry1, box.data.userId)
            })

            test("check entry after add", async () => {
                await checkEntries(key, box.data.userId, {}, [
                    box.data.entry1
                ]);
            })

            test("update specify field of entry", async () => {
                await updateEntry(key, box.data.entry1, box.data.userId, {comment: "newComment"});
            })

            test("check entry after updating", async () => {
                await checkEntries(key, box.data.userId, {}, [
                    box.data.entry1
                ]);
            })
        })

        describe("query with date", () => {
            const box = new Box1()
            box.data.userId = `${new ObjectId()}`

            test("add entry1", async () => {
                box.data.entry1 = box.newEntry()
                await addEntry(key, box.data.entry1, box.data.userId)
            })

            test("add entry1", async () => {
                box.data.entry2 = box.newEntry()
                box.data.entry2.createdAt = now() - 86400
                await addEntry(key, box.data.entry2, box.data.userId)
            })

            test("check", async () => {
                await checkEntries(key, box.data.userId, {}, [
                    box.data.entry1
                ]);
            })
        })

        test("query with offset limit", async () => {
            const box = new Box1()
            box.data.userId = `${new ObjectId}`

            box.data.entry1 = box.newEntry()
            await addEntry(key, box.data.entry1, box.data.userId)

            box.data.entry2 = box.newEntry()
            box.data.entry2.createdAt = now() - 10
            await addEntry(key, box.data.entry2, box.data.userId)

            await checkEntries(key, box.data.userId, {offset: 0, limit: 1}, [box.data.entry1])
            await checkEntries(key, box.data.userId, {offset: 1, limit: 1}, [box.data.entry2])
        })

        test("query with entry id", async () => {
            const box = new Box1()
            box.data.userId = `${new ObjectId()}`
            box.data.entry = box.newEntry()

            await addEntry(key, box.data.entry, box.data.userId)
            await checkEntry(key, box.data.userId, box.data.entry.id, box.data.entry)
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