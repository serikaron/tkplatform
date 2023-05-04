'use strict'

export const version = "0004"

export async function migrate(mongoClient) {
    await addSystemStoresAndAccouts(mongoClient)
    await createIndexes(mongoClient)
}

async function addSystemStoresAndAccouts(mongoClient) {
    await mongoClient.ledger.db
        .collection("stores")
        .insertMany([
            {
                name: "陶宝",
                icon: "/static/stores/taobao.png"
            },
            {
                name: "京东",
                icon: "/static/stores/jd.png"
            },
            {
                name: "抖音",
                icon: "/static/stores/douyin.png"
            },
            {
                name: "拼多多",
                icon: "/static/stores/pdd.png"
            },
            {
                name: "阿里巴巴",
                icon: "/static/stores/aly.png"
            },
            {
                name: "苏宁易购",
                icon: "/static/stores/suning.png"
            },
        ])

    await mongoClient.ledger.db
        .collection("accounts")
        .insertMany([
            {
                name: "陶宝",
                icon: "/static/accounts/taobao.png"
            },
            {
                name: "京东",
                icon: "/static/accounts/jd.png"
            },
            {
                name: "抖音",
                icon: "/static/accounts/douyin.png"
            },
            {
                name: "拼多多",
                icon: "/static/accounts/pdd.png"
            },
            {
                name: "美团",
                icon: "/static/accounts/meituan.png"
            },
            {
                name: "苏宁",
                icon: "/static/accounts/suning.png"
            },
        ])
}

async function createIndexes(mongoClient) {
    await mongoClient.ledger.db
        .collection("ledgerEnteries")
        .createIndex({userId: 1, createdAt: -1})
    await mongoClient.ledger.db
        .collection("withdrawJournalEntries")
        .createIndex({userId: 1, createdAt: -1})
}