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
