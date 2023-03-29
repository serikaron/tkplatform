'use strict'

export const version = "0009"

export async function migrate(mongoClient) {
    await convertSiteId(mongoClient)
    await addDefaultEmpty(mongoClient)
}

async function convertSiteId(mongoClient) {
    await mongoClient.ledger.db
        .collection("siteRecords")
        .updateMany({}, [
            {
                $set: {
                    userSiteId: "$siteId",
                    siteId: ""
                }
            }
        ])
}

async function addDefaultEmpty(mongoClient) {
    await mongoClient.ledger.db
        .collection("siteRecords")
        .updateMany({}, {
            $set: {
                empty: false
            }
        })
}