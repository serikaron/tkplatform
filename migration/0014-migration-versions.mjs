'use strict'

export const version = "0014"

export async function migrate(mongoClient) {
    await mongoClient.system.db
        .collection("versions")
        .insertMany([
            {
                version: "1.0.1",
                url: "www.baidu.com",
                size: 0,
                updateLog: "版本1.0.1",
                constraint: true,
            },
            {
                version: "1.0.0",
                url: "www.baidu.com",
                size: 0,
                updateLog: "版本1.0.0",
                constraint: false,
            },
        ])
}