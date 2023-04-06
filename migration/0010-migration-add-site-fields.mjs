'use strict'

export const version = "0010"

export async function migrate(mongoClient) {
    await mongoClient.site.db
        .collection("sites")
        .updateMany({},
            {
                $set: {
                    url: "",
                    downloadURL: "",
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
                    "site.url": "",
                    "site.downloadURL": ""
                }
            }
        )
}