'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {mergeObjects, now, today} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

const baseURL = "http://localhost:9007"

class Box {
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
            mergeObjects(entry, update)
        }
    })
}

describe.each([
    "ledger",
    "journal"
])("%s", (key) => {
    describe("test entries db", () => {
        describe("modify entry", () => {
            const box = new Box()
            box.data.userId = `${new ObjectId()}`

            test("add entry", async () => {
                box.data.entry1 = box.newEntry()
                await addEntry(key, box.data.entry1, box.data.userId)
            })

            test("check entry after add", async () => {
                await checkEntries(key, box.data.userId, {},
                    {
                        total: 1,
                        items: [box.data.entry1]
                    });
            })

            test("update specify field of entry", async () => {
                await updateEntry(key, box.data.entry1, box.data.userId, {comment: "newComment"});
            })

            test("check entry after updating", async () => {
                await checkEntries(key, box.data.userId, {},
                    {
                        total: 1,
                        items: [box.data.entry1]
                    });
            })
        })

        describe("query with date", () => {
            const box = new Box()
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
                await checkEntries(key, box.data.userId, {},
                    {
                        total: 1,
                        items: [box.data.entry1]
                    });
            })
        })

        test("query with offset limit", async () => {
            const box = new Box()
            box.data.userId = `${new ObjectId}`

            box.data.entry1 = box.newEntry()
            await addEntry(key, box.data.entry1, box.data.userId)

            box.data.entry2 = box.newEntry()
            box.data.entry2.createdAt = now() - 10
            await addEntry(key, box.data.entry2, box.data.userId)

            await checkEntries(key, box.data.userId, {offset: 0, limit: 1},
                {
                    total: 2,
                    items: [box.data.entry1]
                })
            await checkEntries(key, box.data.userId, {offset: 1, limit: 1},
                {
                    total: 2,
                    items: [box.data.entry2]
                })
        })

        test("query with entry id", async () => {
            const box = new Box()
            box.data.userId = `${new ObjectId()}`
            box.data.entry = box.newEntry()

            await addEntry(key, box.data.entry, box.data.userId)
            await checkEntry(key, box.data.userId, box.data.entry.id, box.data.entry)
        })

        test("update nested field", async () => {
            const box = new Box()
            box.data.userId = `${new ObjectId()}`
            box.data.entry = box.newEntry()
            box.data.entry.field = {
                nestedField1: "nestedField1",
                nestedField2: "nestedField2"
            }

            await addEntry(key, box.data.entry, box.data.userId)

            const update = {
                field: {
                    nestedField1: "newNestedField1",
                    nestedField3: "newNestedField3"
                }
            }
            await updateEntry(key, box.data.entry, box.data.userId, update)

            await checkEntry(key, box.data.userId, box.data.entry.id, box.data.entry)
        })
    })
})

describe("test site record", () => {
    const box = new Box()
    box.data.siteId1 = `${new ObjectId()}`
    box.data.userId1 = `${new ObjectId()}`
    box.data.siteId2 = `${new ObjectId()}`
    box.data.userId2 = `${new ObjectId()}`

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
                expect(response.data.total).toBe(1)
                expect(response.data.rate).toBe(1000)
                const record = response.data.list[0]
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
                expect(response.data.total).toBe(1)
                expect(response.data.rate).toBe(1000)
                const record = response.data.list[0]
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
                expect(response.data.total).toBe(2)
                expect(response.data.rate).toBe(1000)
                // check id only
                const ids = response.data.list.map(x => x.id)
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

describe("test ledger statistics", () => {
    const userId = `${new ObjectId()}`
    describe("prepare data", () => {
        const entries = [
            // not count
            {
                principle: {amount: 10000, refunded: false},
                commission: {amount: 10000, refunded: false},
                status: 1,
                createdAt: now() - 86400
            },
            // count
            {
                principle: {amount: 100, refunded: false},
                commission: {amount: 1000, refunded: false},
            },
            {
                principle: {amount: 200, refunded: true},
                commission: {amount: 2000, refunded: false},
            },
            {
                principle: {amount: 300, refunded: false},
                commission: {amount: 3000, refunded: true},
            },
            {
                principle: {amount: 400, refunded: true},
                commission: {amount: 4000, refunded: true},
            },
            {status: 1},
            {status: 1},
        ]
        it("post to server", async () => {
            for (const entry of entries) {
                if (entry.createdAt === undefined) {
                    entry.createdAt = now()
                }
                if (entry.principle === undefined) {
                    entry.principle = {amount: 0, refunded: true}
                }
                if (entry.commission === undefined) {
                    entry.commission = {amount: 0, refunded: true}
                }
                if (entry.status === undefined) {
                    entry.status = 0
                }
                await addEntry("ledger", entry, userId)
            }
        })
    })

    describe("check statistics", () => {
        it("from server", async () => {
            await runTest({
                method: "GET",
                path: `/v1/ledger/statistics/${now() - 100}/${now() + 100}`,
                baseURL,
                userId,
                verify: response => {
                    simpleVerification(response)
                    expect(response.data).toStrictEqual({
                        exceptions: 2,
                        notYetRefunded: 3400,
                        principle: 1000,
                        commission: 10000,
                    })
                }
            })
        })
    })
})

describe("test journal statistics", () => {
    const userId = `${new ObjectId()}`

    it.each([
        // not count
        {amount: 1000, credited: true, createdAt: now()-86400},
        // count
        {amount: 100, credited: false},
        {amount: 200, credited: true}
    ])("($#) prepare journal entry", async (entry) => {
        if (entry.credited === undefined) {
            entry.credited = now()
        }
        await addEntry("journal", entry, userId)
    })

    it.each([
        {principle: {amount: 100, refunded: true}},
        {principle: {amount: 200, refunded: false}},
    ])("($#) prepare ledger entry", async (entry) => {
        entry.createdAt = now()
        await addEntry("ledger", entry, userId)
    })

    it("check statistics", async () => {
        await runTest({
            method: "GET",
            path: `/v1/journal/statistics/${now() - 100}/${now() + 100}`,
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data).toStrictEqual({
                    notYetCredited: 100,
                    credited: 200,
                    principle: 300
                })
            }
        })
    })
})