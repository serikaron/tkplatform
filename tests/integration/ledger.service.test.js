'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {dateToTimestamp, mergeObjects, now, today} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

const baseURL = "http://localhost:9007"

const newEntry = () => {
    return {
        account: "entryAccount",
        comment: "entryComment",
        createdAt: now()
    }
}

const entryFromDate = (date) => {
    const out = newEntry()
    out.createdAt = date
    return out
}

class Box {
    constructor() {
        this._data = {}
    }

    get data() {
        return this._data
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

async function checkEntries(
    {
        key, userId, desired,
        query = {},
        dateRange = {minDate: today(), maxDate: today() + 86400}
    }
) {
    await runTest({
        method: "GET",
        path: `/v1/${key}/entries/${dateRange.minDate}/${dateRange.maxDate}`,
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
                box.data.entry1 = newEntry()
                await addEntry(key, box.data.entry1, box.data.userId)
            })

            test("check entry after add", async () => {
                await checkEntries({
                    key,
                    userId: box.data.userId,
                    desired: {
                        total: 1,
                        items: [box.data.entry1]
                    }
                })
            })

            test("update specify field of entry", async () => {
                await updateEntry(key, box.data.entry1, box.data.userId, {comment: "newComment"});
            })

            test("check entry after updating", async () => {
                await checkEntries({
                    key, userId: box.data.userId,
                    desired: {
                        total: 1,
                        items: [box.data.entry1]
                    }
                });
            })
        })

        describe("query with date", () => {
            const box = new Box()
            box.data.userId = `${new ObjectId()}`

            test("add entry1", async () => {
                box.data.entry1 = newEntry()
                await addEntry(key, box.data.entry1, box.data.userId)
            })

            test("add entry1", async () => {
                box.data.entry2 = newEntry()
                box.data.entry2.createdAt = now() - 86400
                await addEntry(key, box.data.entry2, box.data.userId)
            })

            test("check", async () => {
                await checkEntries({
                    key, userId: box.data.userId,
                    desired: {
                        total: 1,
                        items: [box.data.entry1]
                    }
                });
            })
        })

        test("query with offset limit", async () => {
            const box = new Box()
            box.data.userId = `${new ObjectId}`

            box.data.entry1 = newEntry()
            await addEntry(key, box.data.entry1, box.data.userId)

            box.data.entry2 = newEntry()
            box.data.entry2.createdAt = now() - 10
            await addEntry(key, box.data.entry2, box.data.userId)

            await checkEntries({
                key, userId: box.data.userId,
                query: {offset: 0, limit: 1},
                desired: {
                    total: 2,
                    items: [box.data.entry1]
                }
            })
            await checkEntries({
                key, userId: box.data.userId,
                query: {offset: 1, limit: 1},
                desired: {
                    total: 2,
                    items: [box.data.entry2]
                }
            })
        })

        test("query with entry id", async () => {
            const box = new Box()
            box.data.userId = `${new ObjectId()}`
            box.data.entry = newEntry()

            await addEntry(key, box.data.entry, box.data.userId)
            await checkEntry(key, box.data.userId, box.data.entry.id, box.data.entry)
        })

        test("update nested field", async () => {
            const box = new Box()
            box.data.userId = `${new ObjectId()}`
            box.data.entry = newEntry()
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

        describe("delete entries", () => {
            const deleteEntry = async (userId, query) => {
                await runTest({
                    method: "DELETE",
                    path: `/v1/${key}/entries`,
                    query,
                    baseURL,
                    userId,
                    verify: rsp => {
                        expect(rsp.status).toBe(200)
                    }
                })
            }

            test("delete by year", async () => {
                const box = new Box()
                const userId = `${new ObjectId}`
                box.data.lastYearEntries = [
                    dateToTimestamp(2022, 1, 1),
                    dateToTimestamp(2022, 6, 6),
                    dateToTimestamp(2022, 12, 31)
                ].map(entryFromDate)
                for (const entry of box.data.lastYearEntries) {
                    await addEntry(key, entry, userId)
                }
                box.data.thisYearEntry = entryFromDate(dateToTimestamp(2023, 1, 1))
                await addEntry(key, box.data.thisYearEntry, userId)

                await deleteEntry(userId, {year: 2022})

                await checkEntries({
                    key, userId,
                    dateRange: {
                        minDate: dateToTimestamp(2022, 1, 1),
                        maxDate: dateToTimestamp(2023, 12, 31)
                    },
                    desired: {total: 1, items: [box.data.thisYearEntry]}
                })
            })

            test("delete by month", async () => {
                const box = new Box()
                const userId = `${new ObjectId}`
                box.data.lastMonthEntries = [
                    dateToTimestamp(2022, 1, 1),
                    dateToTimestamp(2022, 1, 15),
                    dateToTimestamp(2022, 1, 31)
                ].map(entryFromDate)
                for (const entry of box.data.lastMonthEntries) {
                    await addEntry(key, entry, userId)
                }
                box.data.thisMonthEntry = entryFromDate(dateToTimestamp(2022, 2, 1))
                await addEntry(key, box.data.thisMonthEntry, userId)

                await deleteEntry(userId, {year: 2022, month: 1})

                await checkEntries({
                    key, userId,
                    dateRange: {
                        minDate: dateToTimestamp(2022, 1, 1),
                        maxDate: dateToTimestamp(2022, 2, 28)
                    },
                    desired: {total: 1, items: [box.data.thisMonthEntry]}
                })
            })

            test("delete by month list", async () => {
                const box = new Box()
                const userId = `${new ObjectId}`
                box.data.entriesToDelete = [
                    dateToTimestamp(2022, 1, 1),
                    dateToTimestamp(2022, 1, 15),
                    dateToTimestamp(2022, 1, 31),
                    dateToTimestamp(2022, 3, 1),
                    dateToTimestamp(2022, 3, 15),
                    dateToTimestamp(2022, 3, 31),
                    dateToTimestamp(2022, 12, 1),
                    dateToTimestamp(2022, 12, 15),
                    dateToTimestamp(2022, 12, 31),
                ].map(entryFromDate)
                for (const entry of box.data.entriesToDelete) {
                    await addEntry(key, entry, userId)
                }
                box.data.keepingEntry = entryFromDate(dateToTimestamp(2022, 6, 1))
                await addEntry(key, box.data.keepingEntry, userId)

                await deleteEntry(userId, {year: 2022, month: [1, 3, 12]})

                await checkEntries({
                    key, userId,
                    dateRange: {
                        minDate: dateToTimestamp(2022, 1, 1),
                        maxDate: dateToTimestamp(2022, 12, 31)
                    },
                    desired: {total: 1, items: [box.data.keepingEntry]}
                })
            })
        })

        test("count entries", async () => {
            const userId = `${new ObjectId}`
            const entries = [
                dateToTimestamp(2021, 1, 1),
                dateToTimestamp(2021, 1, 15),
                dateToTimestamp(2021, 1, 31),
                dateToTimestamp(2021, 2, 1),
                dateToTimestamp(2021, 2, 15),
                dateToTimestamp(2021, 2, 28),
                dateToTimestamp(2021, 12, 1),
                dateToTimestamp(2021, 12, 31),
                dateToTimestamp(2022, 1, 1)
            ].map(entryFromDate)
            for (const entry of entries) {
                await addEntry(key, entry, userId)
            }

            await runTest({
                method: "GET",
                path: `/v1/${key}/entries/count`,
                query: {year: 2021},
                baseURL,
                userId,
                verify: rsp => {
                    simpleVerification(rsp)
                    expect(rsp.data).toStrictEqual([
                        {month: 1, count: 3},
                        {month: 2, count: 3},
                        {month: 12, count: 2},
                    ])
                }
            })
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
                principle: {amount: "100", refunded: false},
                commission: {amount: "1000", refunded: false},
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

    // TODO: to be implemented
    describe("statistics with deleted entry", () => {
    })
})

describe("test journal statistics", () => {
    const userId = `${new ObjectId()}`

    it.each([
        // not count
        {amount: "1000", credited: true, createdAt: now() - 86400},
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
        {principle: {amount: "100", refunded: true}},
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

    describe("statistics with deleted entries", () => {
        //TODO: to be implemented
    })
})

describe("test ledger site", () => {
    const box = new Box()
    const userId = `${new ObjectId()}`

    it("should be ok", async () => {
        await runTest({
            method: "POST",
            path: '/v1/ledger/site',
            body: {
                name: "我的",
                account: "帐号"
            },
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data.id).toBeDefined()
                box.data.ledgerSiteId = response.data.id
            }
        })

        await runTest({
            method: "GET",
            path: '/v1/ledger/sites',
            baseURL,
            userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data).toStrictEqual([
                    {
                        id: `${box.data.ledgerSiteId}`,
                        name: "我的",
                        account: "帐号"
                    }
                ])
            }
        })
    })
})

describe.each([
    "ledger", "journal"
])("%s accounts", (key) => {
    const box = new Box()
    const userId = `${new ObjectId()}`

    const add = async (account) => {
        await runTest({
            method: "POST",
            path: `/v1/user/${key}/account`,
            body: account,
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                expect(rsp.data.accountId).toBeDefined()
                account.id = rsp.data.accountId
            }
        })
    }

    const check = async (desired) => {
        await runTest({
            method: "GET",
            path: `/v1/user/${key}/accounts`,
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                expect(rsp.data).toStrictEqual(desired)
            }
        })
    }

    it("add", async () => {
        box.data.account1 = {
            name: "陶宝",
            account: "my account"
        }
        await add(box.data.account1)
    })

    it("check", async () => {
        await check([box.data.account1])
    })

    it("update", async () => {
        const update = {
            name: "微信",
            icon: "icon-url",
            account: "edited account"
        };
        await runTest({
            method: "PUT",
            path: `/v1/user/${key}/account/${box.data.account1.id}`,
            body: update,
            baseURL,
            userId,
            verify: rsp => {
                expect(rsp.status).toBe(200)
            }
        })
        Object.assign(box.data.account1, update)
    })

    it("check", async () => {
        await check([box.data.account1])
    })

    describe("test delete", () => {
        it("add more", async () => {
            box.data.account2 = {
                name: "京东",
                account: "jd account",
            }
            await add(box.data.account2)
        })

        it("check", async () => {
            await check([box.data.account1, box.data.account2])
        })

        it("delete", async () => {
            await runTest({
                method: "DELETE",
                path: `/v1/user/${key}/account/${box.data.account1.id}`,
                baseURL,
                userId,
                verify: rsp => {
                    expect(rsp.status).toBe(200)
                }
            })
        })

        it("check", async () => {
            await check([box.data.account2])
        })
    })
})

describe("templates", () => {
    const box = new Box()
    const userId = `${new ObjectId()}`

    const defaultTemplate = (id, i) => {
        return {
            id,
            "name": `通用设置${i + 1}`,
            "account": true,
            "taskId": false,
            "store": true,
            "ledgerAccount": true,
            "shop": true,
            "product": false,
            "journalAccount": false,
            "refund": {
                "from": false,
                "type": false
            },
            "received": false,
            "status": true,
            "screenshot": false,
            "comment": true
        }
    }

    const get = async () => {
        let templates = undefined
        await runTest({
            method: "GET",
            path: '/v1/ledger/templates',
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                templates = rsp.data
            }
        })
        return templates
    }

    it("get default templates", async () => {
        const templates = await get()
        const expectTemplates = templates
            .map(x => x.id)
            .map(defaultTemplate)
        expect(templates).toStrictEqual(expectTemplates)
        box.data.templates = expectTemplates
    })

    it("update", async () => {
        await runTest({
            method: "PUT",
            path: `/v1/ledger/template/${box.data.templates[3].id}`,
            body: {
                name: "template3",
                refund: {type: true},
            },
            baseURL,
            userId,
            verify: rsp => {
                expect(rsp.status).toBe(200)
            }
        })
        box.data.templates[3].name = "template3"
        box.data.templates[3].refund.type = true
    })

    it("check after update", async () => {
        const rsp = await get()
        expect(rsp).toStrictEqual(box.data.templates)
    })
})


describe("sites", () => {
    const box = new Box()
    const userId = `${new ObjectId()}`

    const check = async (desired) => {
        await runTest({
            method: "GET",
            path: '/v1/ledger/sites',
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                expect(rsp.data).toStrictEqual(desired)
            }
        })
    }

    const add = async (site) => {
        await runTest({
            method: "POST",
            path: '/v1/ledger/site',
            body: site,
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                expect(rsp.data.id).toBeDefined()
                site.id = rsp.data.id
            }
        })
    }

    it("add two", async () => {
        box.data.site1 = {
            name: "site1",
            account: "account1"
        }
        await add(box.data.site1)
        box.data.site2 = {
            name: "site2",
            account: "account2",
        }
        await add(box.data.site2)
    })

    it("check", async () => {
        await check([box.data.site1, box.data.site2])
    })

    it("delete", async () => {
        await runTest({
            method: "DELETE",
            path: `/v1/ledger/site/${box.data.site1.id}`,
            baseURL,
            userId,
            verify: rsp => {
                expect(rsp.status).toBe(200)
            }
        })
    })

    it("check after update", async () => {
        await check([box.data.site2])
    })
})

describe("refund all", () => {
    const box = new Box()
    const userId = `${new ObjectId()}`

    it("should update correctly", async () => {
        box.data.entries = [
            {principle: true, commission: true},
            {principle: false, commission: true},
            {principle: true, commission: false},
            {principle: false, commission: false},
        ].map(x => {
            const out = newEntry()
            out.principle = {
                amount: 100,
                refunded: x.principle
            }
            out.commission = {
                amount: 10,
                refunded: x.commission
            }
            return out
        })
        for (const entry of box.data.entries) {
            await addEntry("ledger", entry, userId)
        }

        await runTest({
            method: "PUT",
            path: '/v1/ledger/entries/refunded',
            baseURL,
            userId,
            verify: rsp => {
                expect(rsp.status).toBe(200)
            }
        })

        box.data.entries.forEach(x => {
            x.principle.refunded = true
            x.commission.refunded = true
        })

        await checkEntries({
            key: "ledger",
            userId,
            desired: {
                total: 4,
                items: box.data.entries
            }
        })
    })
})

describe("credit all", () => {
    const box = new Box()
    const userId = `${new ObjectId()}`

    it("should update correctly", async () => {
        box.data.entries = [
            true, false
        ].map(x => {
            const out = newEntry()
            out.credited = x
            return out
        })
        for (const entry of box.data.entries) {
            await addEntry("journal", entry, userId)
        }

        await runTest({
            method: "PUT",
            path: '/v1/journal/entries/credited',
            baseURL,
            userId,
            verify: rsp => {
                expect(rsp.status).toBe(200)
            }
        })

        box.data.entries.forEach(x => {
            x.credited = true
        })

        await checkEntries({
            key: "journal",
            userId,
            desired: {
                total: 2,
                items: box.data.entries
            }
        })
    })
})

describe("analyse detail", () => {
    const box = new Box()
    const userId = `${new ObjectId()}`
    box.data.sites = [
        new ObjectId(), new ObjectId(), new ObjectId()
    ].map((x, i) => {
        return {
            id: `${x}`,
            name: `site-${i}`,
            account: `account-${i}`
        }
    })

    describe("prepare", () => {
        describe.each([
            {site: box.data.sites[0]},
            {site: box.data.sites[1]}
        ])("site ($#)", ({site}) => {
            describe.each([
                {
                    principle: {amount: 100, refunded: true},
                    commission: {amount: 1000, refunded: true},
                },
                {
                    principle: {amount: 200, refunded: false},
                    commission: {amount: 2000, refunded: true},
                },
                {
                    principle: {amount: 300, refunded: true},
                    commission: {amount: 3000, refunded: false},
                },
                {
                    principle: {amount: 400, refunded: false},
                    commission: {amount: 4000, refunded: false},
                },
            ])("entry ($#)", ({principle, commission}) => {
                it("prepare", async () => {
                    const entry = newEntry()
                    entry.principle = principle
                    entry.commission = commission
                    entry.site = site
                    await addEntry("ledger", entry, userId)
                })
            })
        })

        describe.each([
            {site: box.data.sites[0]},
            {site: box.data.sites[2]}
        ])("site ($#)", ({site}) => {
            describe.each([
                {amount: 100, credited: true},
                {amount: 200, credited: false},
                {amount: 300, credited: false},
            ])("entry ($#)", ({amount, credited}) => {
                it("prepare", async () => {
                    const entry = newEntry()
                    entry.amount = amount
                    entry.credited = credited
                    entry.site = site
                    await addEntry("journal", entry, userId)
                })
            })
        })
    })

    it("analyse should be correct", async () => {
        await runTest({
            method: "GEt",
            path: `/v1/ledger/analyse/detail/${now() - 86400}/${now() + 86400}`,
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                expect(rsp.data.sort((a, b) => {
                    if (a.site.id < b.site.id) {
                        return -1
                    }
                    if (a.site.id > b.site.id) {
                        return 1
                    }
                    return 0
                })).toStrictEqual([
                    {
                        site: box.data.sites[0],
                        total: 7600,
                        principle: 600,
                        commission: 7000,
                        withdrawingSum: 500
                    },
                    {
                        site: box.data.sites[1],
                        total: 7600,
                        principle: 600,
                        commission: 7000,
                        withdrawingSum: 0
                    },
                    {
                        site: box.data.sites[2],
                        total: 0,
                        principle: 0,
                        commission: 0,
                        withdrawingSum: 500
                    },
                ].sort((a, b) => {
                    if (a.site.id < b.site.id) {
                        return -1
                    }
                    if (a.site.id > b.site.id) {
                        return 1
                    }
                    return 0
                }))
            }
        })
    })
})

describe("analyse overview", () => {

    const getOverview = async (userId) => {
        let data = undefined
        await runTest({
            method: "GET",
            path: `/v1/ledger/analyse/overview/${now() - 86400}/${now() + 86400}`,
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                data = rsp.data
            }
        })
        return data
    }

    describe("with entries", () => {
        const userId = `${new ObjectId()}`
        const box = new Box()

        describe.each([
            {
                principle: {amount: 10, refunded: true},
                commission: {amount: 20, refunded: true},
                status: 0,
            },
            {
                principle: {amount: 30, refunded: false},
                commission: {amount: 40, refunded: true},
                status: 0,
            },
            {
                principle: {amount: 50, refunded: true},
                commission: {amount: 60, refunded: false},
                status: 0,
            },
            {
                principle: {amount: 70, refunded: false},
                commission: {amount: 80, refunded: false},
                status: 0,
            },
            {
                principle: {amount: 90, refunded: true},
                commission: {amount: 100, refunded: true},
                status: 1,
            },
            {
                principle: {amount: 110, refunded: false},
                commission: {amount: 120, refunded: false},
                status: 1,
            },
        ])
        ("prepare ledger entry ($#)", ({principle, commission, status}) => {
            it("post", async () => {
                const entry = newEntry()
                entry.principle = principle
                entry.commission = commission
                entry.status = status
                await addEntry("ledger", entry, userId)
            })
        })

        test("overview", async () => {
            const overview = await getOverview(userId)
            expect(overview.overview).toStrictEqual({
                principle: 360,
                commission: 420,
                notYetRefunded: 470,
                count: 6,
            })
        })

        test("exception", async () => {
            const overview = await getOverview(userId)
            expect(overview.exception).toStrictEqual({
                count: 2,
                amount: 420,
                principle: 200,
                commission: 220,
            })
        })

        test("principle", async () => {
            const overview = await getOverview(userId)
            expect(overview.principle).toStrictEqual({
                notYetCount: 3,
                notYetAmount: 210,
                refundedCount: 3,
                refundedAmount: 150,
            })
        })

        test("commission", async () => {
            const overview = await getOverview(userId)
            expect(overview.commission).toStrictEqual({
                notYetCount: 3,
                notYetAmount: 260,
                refundedCount: 3,
                refundedAmount: 160,
            })
        })

        describe("prepare journal entries", () => {
            box.data.accounts = [
                {id: `${new ObjectId()}`, accountName: "微信"},
                {id: `${new ObjectId()}`, accountName: "支付宝"},
                {id: `${new ObjectId()}`, accountName: "工行"},
                {id: `${new ObjectId()}`, accountName: "招行"},
            ].map(x => {
                return {
                    id: x.id,
                    name: x.accountName,
                    icon: `${x.accountName}-icon`,
                    userAccount: `${x.accountName}-userAccount`
                }
            })

            it.each([
                {journalAccount: box.data.accounts[0], amount: 10, credited: true},
                {journalAccount: box.data.accounts[0], amount: 20, credited: false},
                {journalAccount: box.data.accounts[1], amount: 30, credited: true},
                {journalAccount: box.data.accounts[1], amount: 40, credited: false},
                {journalAccount: box.data.accounts[2], amount: 50, credited: true},
                {journalAccount: box.data.accounts[2], amount: 60, credited: false},
                {journalAccount: box.data.accounts[3], amount: 70, credited: true},
                {journalAccount: box.data.accounts[3], amount: 80, credited: false},
                {journalAccount: box.data.accounts[0], amount: 90, credited: true},
                {journalAccount: box.data.accounts[0], amount: 100, credited: false},
            ])
            ("post entry ($#)", async ({journalAccount, amount, credited}) => {
                const entry = newEntry()
                entry.journalAccount = journalAccount
                entry.amount = amount
                entry.credited = credited
                await addEntry("journal", entry, userId)
            })
        })

        test("cardDetail", async () => {
            const overview = await getOverview(userId)
            expect(overview.cardDetail.total).toStrictEqual({
                notYetCredited: 300,
                credited: 250,
                count: 10,
            })

            const actuallyItems = overview.cardDetail.items.sort((a, b) => {
                if (a.journalAccount.id < b.journalAccount.id) {
                    return -1
                }
                if (a.journalAccount.id > b.journalAccount.id) {
                    return 1
                }
                return 0
            })
            const expectItems = [
                {
                    journalAccount: box.data.accounts[0],
                    notYetCredited: 120,
                    credited: 100,
                    count: 4
                },
                {
                    journalAccount: box.data.accounts[1],
                    notYetCredited: 40,
                    credited: 30,
                    count: 2,
                },
                {
                    journalAccount: box.data.accounts[2],
                    notYetCredited: 60,
                    credited: 50,
                    count: 2,
                },
                {
                    journalAccount: box.data.accounts[3],
                    notYetCredited: 80,
                    credited: 70,
                    count: 2,
                },
            ]
                .sort((a, b) => {
                    if (a.journalAccount.id < b.journalAccount.id) {
                        return -1
                    }
                    if (a.journalAccount.id > b.journalAccount.id) {
                        return 1
                    }
                    return 0
                })
            expect(actuallyItems).toStrictEqual(expectItems)
        })
    })

    describe("without entries", () => {
        const userId = `${new ObjectId()}`
        it("should be ok", async () => {
            const overview = await getOverview(userId)
            expect(overview).toStrictEqual({
                overview: {
                    commission: 0,
                    principle: 0,
                    notYetRefunded: 0,
                    count: 0
                },
                exception: {
                    count: 0,
                    principle: 0,
                    commission: 0,
                    amount: 0
                },
                commission: {
                    notYetCount: 0,
                    notYetAmount: 0,
                    refundedCount: 0,
                    refundedAmount: 0,
                },
                principle: {
                    notYetCount: 0,
                    notYetAmount: 0,
                    refundedCount: 0,
                    refundedAmount: 0,
                },
                cardDetail: {
                    total: {
                        notYetCredited: 0,
                        credited: 0,
                        count: 0
                    },
                    items: []
                }
            })
        })
    })
})

describe("test ledger entries filter", () => {
    const makeEntry = (replace) => {
        const entry = newEntry()
        entry.site = {
            id: `${new ObjectId()}`,
            name: "siteName",
        }
        entry.principle = {
            amount: 100,
            refunded: true
        }
        entry.commission = {
            amount: 10,
            refunded: true
        }
        entry.store = {
            id: `${new ObjectId()}`,
            name: "storeName",
        }
        entry.account = "account"
        entry.ledgerAccount = {
            account: "ledgerAccount"
        }
        entry.shop = "shop"
        entry.orderId = "orderId"
        entry.refund = {
            from: 0
        }
        entry.status = 0

        Object.assign(entry, replace)

        return entry
    }

    const replaceSite = {id: `${new ObjectId()}`, name: "小吉他"}
    const replaceStore = {id: `${new ObjectId()}`, name: "陶宝"}
    const userId = `${new ObjectId()}`
    const box = new Box()
    box.data.entries = {}

    const d = [
        {
            key: "replace-site",
            replacement: {site: replaceSite},
        },
        {
            key: "refund-from",
            replacement: {refund: {from: 1}},
        },
        {
            key: "principle-unrefunded",
            replacement: {principle: {amount: 200, refunded: false}}
        },
        {
            key: "commission-unrefunded",
            replacement: {commission: {amount: 20, refunded: false}},
        },
        {
            key: "all-unrefunded",
            replacement: {
                principle: {amount: 300, refunded: false},
                commission: {amount: 30, refunded: false},
            }
        },
        {
            key: "replace-store",
            replacement: {store: replaceStore}
        },
        {
            key: "account",
            replacement: {account: "大头文"}
        },
        {
            key: "ledger-account",
            replacement: {ledgerAccount: {account: "大头文"}}
        },
        {
            key: "shop",
            replacement: {shop: "苹果店"}
        },
        {
            key: "order-id",
            replacement: {orderId: "99876"}
        },
        {
            key: "status",
            replacement: {status: 1}
        }
    ]
    d.forEach(x => {
        box.data.entries[x.key] = makeEntry(x.replacement)
    })

    describe.each(d.map(x => x.key))
    ("($#) prepare entries for filter", (key) => {
        it("post", async () => {
            const entry = box.data.entries[key]
            await addEntry("ledger", entry, userId)
        })
    })

    describe.each([
        {
            filter: {siteName: "小吉他"},
            result: [box.data.entries["replace-site"]]
        },
        {
            filter: {siteId: replaceSite.id},
            result: [box.data.entries["replace-site"]]
        },
        {
            filter: {refundStatus: 1},
            result: Object.keys(box.data.entries)
                .filter(x => x.search("unrefunded") === -1)
                .map(x => box.data.entries[x])
        },
        {
            filter: {refundStatus: 2},
            result: Object.keys(box.data.entries)
                .filter(x => x.search("unrefunded") !== -1)
                .map(x => box.data.entries[x])
        },
        {
            filter: {refundStatus: 3},
            result: [box.data.entries["principle-unrefunded"], box.data.entries["all-unrefunded"]]
        },
        {
            filter: {refundStatus: 4},
            result: [box.data.entries["commission-unrefunded"], box.data.entries["all-unrefunded"]]
        },
        {
            filter: {refundFrom: 1},
            result: Object.keys(box.data.entries)
                .filter(x => x !== "refund-from")
                .map(x => box.data.entries[x])
        },
        {
            filter: {refundFrom: 2},
            result: [box.data.entries["refund-from"]]
        },
        {
            filter: {storeId: replaceStore.id},
            result: [box.data.entries["replace-store"]]
        },
        {
            filter: {key: "头"},
            result: [box.data.entries["account"], box.data.entries["ledger-account"]]
        },
        {
            filter: {key: "苹果"},
            result: [box.data.entries["shop"]]
        },
        {
            filter: {key: "99876"},
            result: [box.data.entries["order-id"]]
        },
        {
            filter: {status: 1},
            result: Object.keys(box.data.entries)
                .filter(x => x !== "status")
                .map(x => box.data.entries[x])
        },
        {
            filter: {status: 2},
            result: [box.data.entries["status"]]
        },
        {
            filter: {minPrinciple: 200},
            result: ["principle-unrefunded", "all-unrefunded"]
                .map(x => box.data.entries[x])
        },
        {
            filter: {maxPrinciple: 199},
            result: Object.keys(box.data.entries)
                .filter(x => x !== "principle-unrefunded" && x !== "all-unrefunded")
                .map(x => box.data.entries[x])
        },
        {
            filter: {minPrinciple: 200, maxPrinciple: 299},
            result: [box.data.entries["principle-unrefunded"]]
        },
    ])
    ("($filter) filter should work correctly", ({filter, result}) => {
        it("check", async () => {
            await checkEntries({
                key: "ledger",
                userId,
                query: filter,
                desired: {
                    total: result.length,
                    items: result
                }
            })
        })
    })
})

describe("test journal entries filter", () => {
    const makeEntry = (replace) => {
        const entry = newEntry()
        entry.site = {
            id: `${new ObjectId()}`,
            name: "siteName",
        }
        entry.credited = false
        entry.account = "account"
        entry.journalAccount = {
            account: "ledgerAccount"
        }
        entry.orderId = "orderId"
        entry.amount = 100

        Object.assign(entry, replace)

        return entry
    }

    const replaceSite = {id: `${new ObjectId()}`, name: "小吉他"}
    const userId = `${new ObjectId()}`
    const box = new Box()
    box.data.entries = {}

    const d = [
        {
            key: "replace-site",
            replacement: {site: replaceSite},
        },
        {
            key: "credited",
            replacement: {credited: true},
        },
        {
            key: "account",
            replacement: {account: "大头文"}
        },
        {
            key: "journal-account",
            replacement: {journalAccount: {account: "大头文"}}
        },
        {
            key: "order-id",
            replacement: {orderId: "99876"}
        },
        {
            key: "amount-200",
            replacement: {amount: 200}
        },
        {
            key: "amount-300",
            replacement: {amount: 300}
        },
    ]
    d.forEach(x => {
        box.data.entries[x.key] = makeEntry(x.replacement)
    })

    describe.each(d.map(x => x.key))
    ("($#) prepare entries for filter", (key) => {
        it("post", async () => {
            const entry = box.data.entries[key]
            await addEntry("journal", entry, userId)
        })
    })

    describe.each([
        {
            filter: {siteName: "小吉他"},
            result: [box.data.entries["replace-site"]]
        },
        {
            filter: {siteId: replaceSite.id},
            result: [box.data.entries["replace-site"]]
        },
        {
            filter: {key: "头"},
            result: [box.data.entries["account"], box.data.entries["journal-account"]]
        },
        {
            filter: {key: "99876"},
            result: [box.data.entries["order-id"]]
        },
        {
            filter: {credited: 1},
            result: [box.data.entries["credited"]]
        },
        {
            filter: {credited: 2},
            result: Object.keys(box.data.entries)
                .filter(x => x !== "credited")
                .map(x => box.data.entries[x])
        },
        {
            filter: {minAmount: 200},
            result: ["amount-200", "amount-300"]
                .map(x => box.data.entries[x])
        },
        {
            filter: {maxAmount: 199},
            result: Object.keys(box.data.entries)
                .filter(x => x.search("amount") === -1)
                .map(x => box.data.entries[x])
        },
        {
            filter: {minAmount: 200, maxAmount: 299},
            result: [box.data.entries["amount-200"]]
        },
    ])
    ("($filter) filter should work correctly", ({filter, result}) => {
        it("check", async () => {
            await checkEntries({
                key: "journal",
                userId,
                query: filter,
                desired: {
                    total: result.length,
                    items: result
                }
            })
        })
    })
})