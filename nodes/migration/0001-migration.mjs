'use strict'

export const version = "0001"
export async function migrate(mongoClient) {
    await mongoClient.user.db.collection("users").createIndex({phone: 1}, {unique: true, name: "idx_users_phone"})
}
