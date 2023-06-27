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
