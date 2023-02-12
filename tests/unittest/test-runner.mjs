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