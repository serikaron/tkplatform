'use strict'

export async function serialTest(items, testIt) {
    for (const item of items) {
        await testIt(item)
    }
}

export async function parallelRun(items, testIt) {
    await Promise.all(items.map(async item => {
        await testIt(item)
    }))
}

export function simpleCheckResponse(response, status, code, msg, data) {
    if (response.status === 500 && response.body.code === 1) {
        throw new Error(response.body.msg)
    }
    expect(response.status).toBe(status)
    expect(response.body.code).toEqual(code)
    expect(response.body.msg).toEqual(msg)
    expect(response.body.data).toEqual(data)
}