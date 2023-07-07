'use strict'

import {recordTypeMember, recordTypeRice} from "../payment/itemType.mjs";

export const version = "0016"

const walletRecords = (mongoClient) => {
    return mongoClient.payment.db.collection("walletRecords")
}

const getWalletRecordWithType = async (mongoClient, userId, type) => {
    return await walletRecords(mongoClient).find({
        userId: userId,
        type: type
    })
        .toArray()
}

const sumWallet = async (mongoClient, userId, type, fn) => {
    const records = await getWalletRecordWithType(mongoClient, userId, type)
    return records.reduce((prev, curr) => {
        return prev + fn(curr)
    }, 0)
}

const sumRecharge = async (mongoClient, userId) => {
    return await sumWallet(mongoClient, userId, recordTypeRice, (record) => {
            return record.hasOwnProperty("rice") && record.rice.hasOwnProperty("price") ?
                record.rice.price : 0
        })
        +
        await sumWallet(mongoClient, userId, recordTypeMember, (record) => {
            return record.hasOwnProperty("member") && record.member.hasOwnProperty("price") ?
                record.member.price : 0
        })
}

const countRecharge = async (mongoClient, userId) => {
    return await walletRecords(mongoClient).countDocuments({
            userId: userId,
            type: recordTypeMember
        })
        +
        await walletRecords(mongoClient).countDocuments({
            userId: userId,
            type: recordTypeRice
        })
}

export async function migrate(mongoClient) {
    const uids = await mongoClient.payment.db
        .collection("walletRecords")
        .distinct("userId")

    for (const uid of uids) {
        const recharge = await sumRecharge(mongoClient, uid)
        const count = await countRecharge(mongoClient, uid)
        console.log(`uid: ${uid}, recharge: ${recharge}, count: ${count}`)
        await mongoClient.payment.db.collection("wallet")
            .updateOne({
                userId: uid
            }, {
                $set: {
                    "accumulated.recharge": recharge,
                    "accumulated.rechargeCount": count
                }
            })
    }
}