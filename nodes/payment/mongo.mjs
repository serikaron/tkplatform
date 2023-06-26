'use strict'

import * as dotenv from 'dotenv'
import {connectPayment} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";

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
        getRiceItems: async () => {
            return await collection.riceItems.find().toArray()
        },
        getWallet: async (userId) => {
            return await collection.wallets.findOne({userId: new ObjectId(userId)})
        },
        // payWithRices: async (userId, price) => {
        // },
        updateWallet: async (userId, update) => {
            await collection.wallets
                .updateOne(
                    {userId: new ObjectId(userId)},
                    {$inc: update},
                    {upsert: true}
                )
        },
        addPayLog: async (userId, amount, itemType, item) => {
            const r = await collection.payLogs
                .insertOne({
                    userId: new ObjectId(userId),
                    amount, itemType, item
                })
            return r.insertedId
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
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
