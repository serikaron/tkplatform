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
            {
                key: "upLineCommission",
                value: 0.1,
            },
            {
                key: "claimDownLinePrice",
                value: 10,
            }
        ])
}