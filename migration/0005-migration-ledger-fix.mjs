'use strict'

export const version = "0005"

export async function migrate(mongoClient) {
    await createAccounts(mongoClient)
    await createIndexes(mongoClient)
}

async function createAccounts(mongoClient) {
    await mongoClient.ledger.db
        .collection("ledgerAccounts")
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
    await mongoClient.ledger.db
        .collection("journalAccounts")
        .insertMany([
            {
                name: "微信",
                icon: "/static/accounts/wechat.png"
            },
            {
                name: "支付宝",
                icon: "/static/accounts/alipay.png"
            },
            {
                name: "中国工商银行",
                icon: "/static/accounts/icbc.png"
            },
            {
                name: "中国建设银行",
                icon: "/static/accounts/ccb.png"
            },
            {
               name: "中国银行",
               icon: "/static/accounts/boc.png"
            },
        ])
}

async function createIndexes(mongoClient) {
    await mongoClient.ledger.db
        .collection("ledgerEntries")
        .createIndex({userId: 1, createdAt: -1})
    await mongoClient.ledger.db
        .collection("withdrawJournalEntries")
        .createIndex({userId: 1, createdAt: -1})
}