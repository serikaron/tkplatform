'use strict'

export const version = "0008"

export async function migrate(mongoClient) {
    await addSitesForTest(mongoClient)
}

async function addSitesForTest(mongoClient) {
    await mongoClient.site.db
        .collection("sites")
        .insertMany([
            {
                name: "小吉他1",
                icon: "/static/sites/001.png"
            },
            {
                name: "皮卡单1",
                icon: "/static/sites/002.png"
            }
        ])
}