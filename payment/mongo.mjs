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
            return await getWallet(collection, userId)
        },
        payWithRices: async (userId, price) => {
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}

async function getWallet(collection, userId) {
    const wallet = await collection.wallets.findOne({userId: new ObjectId(userId)})
    return wallet !== null ? wallet : {
        rice: 0
    }
}

async function payWithRices(client, collection, userId, price) {
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
}
