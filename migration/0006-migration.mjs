'use strict'

export async function migrate(mongoClient) {
    await createIndexes(mongoClient)
}

async function createIndexes(mongoClient) {
    await mongoClient.ledger.db
        .collection("siteRecords")
        .createIndexes([{userId: 1, createdAt: -1}])
}

