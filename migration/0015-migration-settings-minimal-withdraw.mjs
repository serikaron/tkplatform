'use strict'

export const version = "0015"

export async function migrate(mongoClient) {
    await mongoClient.system.db
        .collection("settings")
        .insertMany([
            {
                key: "minimalWithdraw",
                value: 10000,
            },
        ])
}