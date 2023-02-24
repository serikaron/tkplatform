'use strict'

export const version = "0002"

export async function migrate(mongoClient) {
    await mongoClient.system.db
        .collection("settings")
        .insertMany([
            {
                key: "registerPrice",
                value: {daysForRegister: 7, daysForInvite: 3}
            },
        ])
}
