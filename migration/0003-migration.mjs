'use strict'

export const version = "0003"

export async function migrate(mongoClient) {
    await moveSiteFromSystemToSite(mongoClient)
    await createIndexUserSites(mongoClient)
}

async function moveSiteFromSystemToSite(mongoClient) {
    await mongoClient.system.db
        .collection("settings")
        .deleteOne({key: "sites"})

    await mongoClient.site.db
        .collection("sites")
        .insertMany([
            {
                key: "registerPrice",
                value: {daysForRegister: 7, daysForInvite: 3}
            },
            {
                key: "sites",
                value: [
                    {
                        name: "小吉他",
                        icon: "/static/sites/001.png"
                    },
                    {
                        name: "皮卡单",
                        icon: "/static/sites/002.png"
                    }
                ]
            }
        ])
}

async function createIndexUserSites(mongoClient) {
    await mongoClient.site.db
        .collection("userSites")
        .createIndex({userId: 1}, {unique: true})
}