'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {today} from "../../common/utils.mjs";

const baseURL = "http://localhost:9007"
const userId = "60f6a4b4f4b2384f8c40b1ac"

class Box {
    constructor() {
        this._entryId = undefined
    }

    get entryId() {
        return this._entryId
    }

    set entryId(id) {
        this._entryId = id
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
                    })
            }
        })
    })

    test("update entry", async () => {
        await runTest({
            method: "PUT",
            path: `/v1/ledger/entry/${box.entryId}`,
            body: {kept: true, commission: true, principle: true},
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
                        expect(entry.msg).toBe("a test ledger entry")
                        expect(entry.createdAt).not.toBeUndefined()
                        expect(entry.kept).toBe(true)
                        expect(entry.commission.refunded).toBe(true)
                        expect(entry.principle.refunded).toBe(true)
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
                })
            }
        })
    })

    test("update entry", async () => {
        await runTest({
            method: "PUT",
            path: `/v1/journal/entry/${box.entryId}`,
            body: {credited: true},
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
                    expect(entry.msg).toBe("a journal entry")
                    expect(entry.createdAt).not.toBeUndefined()
                    expect(entry.credited).toBe(true)
                })
            }
        })
    })
})