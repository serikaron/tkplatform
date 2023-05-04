'use strict'

export const version = "0007"

export async function migrate(mongoClient) {
    await rename(mongoClient)
}

async function rename(mongoClient) {
    await mongoClient.ledger.db
        .collection("stores")
        .updateOne(
            {name: "陶宝"},
            {$set: {name: "淘宝"}}
        )
    await mongoClient.ledger.db
        .collection("accounts")
        .updateOne(
            {name: "陶宝"},
            {$set: {name: "淘宝"}}
        )
    await mongoClient.ledger.db
        .collection("ledgerAccounts")
        .updateOne(
            {name: "陶宝"},
            {$set: {name: "淘宝"}}
        )
}

