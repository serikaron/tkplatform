'use strict'

export const version = "0012"

export async function migrate(mongoClient) {
    await mongoClient.site.db
        .collection("sites")
        .updateMany({},
            {
                $set: {
                    url: "https://www.baidu.com",
                    downloadURL: "https://www.baidu.com",
                    status: 1,
                    rates: {
                        hot: 0,
                        quality: 0,
                    },
                    isFree: true
                }
            }
        )
    await mongoClient.site.db
        .collection('userSites')
        .updateMany({},
            {
                $set: {
                    "site.url": "https://www.baidu.com",
                    "site.downloadURL": "https://www.baidu.com"
                }
            }
        )
}