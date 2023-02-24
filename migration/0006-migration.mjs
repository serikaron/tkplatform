'use strict'

export async function migrate(mongoClient) {
    await createIndexes(mongoClient)
    await modifyUserSitesIndexes(mongoClient)
}

async function createIndexes(mongoClient) {
    await mongoClient.ledger.db
        .collection("siteRecords")
        .createIndexes([{userId: 1, createdAt: -1}])
}

async function modifyUserSitesIndexes(mongoClient) {
    await mongoClient.site.db.collection("userSites").dropIndex("userId_1")
    await mongoClient.site.db.collection("userSites").createIndex({userId:1})
}
