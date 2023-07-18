'use strict'

import * as dotenv from 'dotenv'
import {connectPayment} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";
import {pendingStatus} from "./logStatus.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const payment = await connectPayment()
    const collection = {
        memberItems: payment.db.collection("memberItems"),
        riceItems: payment.db.collection("riceItems"),
        wallets: payment.db.collection("wallets"),
        payLogs: payment.db.collection("payLogs"),
        walletRecords: payment.db.collection("walletRecords"),
    }
    req.context.mongo = {
        client: payment.client, db: payment.db, collection,
        getMemberItems: async () => {
            return await collection.memberItems.find().toArray()
        },
        getMemberItem: async (id) => {
            return await collection.memberItems.findOne({
                _id: new ObjectId(id)
            })
        },
        getRiceItems: async () => {
            return await collection.riceItems.find().toArray()
        },
        getRiceItem: async (id) => {
            return await collection.riceItems.findOne({
                _id: new ObjectId(id)
            })
        },
        getWallet: async (userId) => {
            return await collection.wallets.findOne({userId: new ObjectId(userId)})
        },
        // payWithRices: async (userId, price) => {
        // },
        updateWallet: async (userId, update) => {
            await updateWallet(collection.wallets, userId, update)
        },
        addRice: async (userId, rice) => {
            await updateWallet(collection.wallets, userId, {rice: rice})
        },
        addCash: async (userId, cash) => {
            await updateWallet(collection.wallets, userId, {cash})
        },
        incRecharge: async (userId, amount) => {
            await updateWallet(collection.wallets, userId, {
                "accumulated.rechargeCount": 1,
                "accumulated.recharge": amount
            })
        },
        addPayLog: async (userId, amount, itemType, item) => {
            const r = await collection.payLogs
                .insertOne({
                    userId: new ObjectId(userId),
                    status: pendingStatus,
                    amount, itemType, item
                })
            return r.insertedId
        },
        getPayLog: async (id) => {
            return await collection.payLogs.findOne({
                _id: new ObjectId(id)
            })
        },
        updateLogStatus: async (id, status) => {
            await collection.payLogs.updateOne(
                {_id: id},
                {$set: {status: status}}
            )
        },
        addWalletRecord: async (record) => {
            await collection.walletRecords.insertOne(record)
        },
        getWalletRecordWithType: async (userId, type) => {
            return await collection.walletRecords.find({
                userId: userId,
                type: type
            })
                .toArray()
        },
        addPaymentRecord: async (record) => {
            await payment.db.collection("paymentRecords").insertOne(record)
        },
        addRiceRecord: async (record) => {
            await payment.db.collection("riceRecords").insertOne(record)
        },
        addMemberRecord: async (record) => {
            await payment.db.collection("memberRecords").insertOne(record)
        },
        addWithdrawRecord: async (record) => {
            await payment.db.collection("withdrawRecords").insertOne(record)
        },
        getRecords: async (collectionName, offset, limit, {phone, id}) => {
            const filter = {}
            if (phone !== undefined && phone !== null) {
                filter.phone = {$regex: `.*${phone}.*`}
            }
            if (id !== undefined && id !== null) {
                filter._id = id
            }

            console.log(`filter: ${JSON.stringify(filter)}`)

            const items = await payment.db.collection(collectionName)
                .find(filter)
                .sort({_id: -1})
                .skip(offset)
                .limit(limit)
                .toArray()

            const count = await payment.db.collection(collectionName)
                .countDocuments(filter)
            return {count, items}
        },
        getWithdrawRecord: async (id) => {
            return await payment.db.collection("withdrawRecords")
                .findOne({_id: new ObjectId(id)})
        },
        updateWithdrawRecord: async (id, status, remark, auditedAt) => {
            await payment.db.collection("withdrawRecords")
                .updateOne(
                    {_id: new ObjectId(id)},
                    {$set: {status, remark, auditedAt}}
                )
        },
        getFeeSetting: async () => {
            return await payment.db.collection("withdrawFeeSetting")
                .findOne()
        },
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}

async function updateWallet(wallets, userId, update) {
    await wallets
        .updateOne(
            {userId: new ObjectId(userId)},
            {$inc: update},
            {upsert: true}
        )
}

// async function payWithRices(client, collection, userId, price) {
// const session = client.startSession()
// session.startTransaction()
// try {
//     const wallet = await getWallet(collection, userId)
//     if ()
//     await collection.users
//         .updateOne(inviter.filter, inviter.update)
//     await session.commitTransaction()
//     return result.insertedId
// } catch (error) {
//     await session.abortTransaction()
//     handlerError(error)
//     return null
// } finally {
//     await session.endSession()
// }
// }
