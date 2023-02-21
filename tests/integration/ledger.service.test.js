'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {today} from "../../common/utils.mjs";

const baseURL = "http://localhost:9007"
const userId = "60f6a4b4f4b2384f8c40b1ac"

class Box {
    constructor() {
        this._entryId = undefined
        this._keptAt = undefined
        this._createdAt = undefined
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