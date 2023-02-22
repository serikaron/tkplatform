'use strict'

import * as dotenv from 'dotenv'
import {connectPayment} from "../common/mongo.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const payment = await connectPayment()
    const collection = {
        memberItems: payment.db.collection("memberItems"),
        riceItems: payment.db.collection("riceItems"),
    }
    req.context.mongo = {
        client: payment.client, db: payment.db, collection,
        getMemberItems: async () => {
            return await collection.memberItems.find().toArray()
        },
        getRiceItems: async () => {
            return await collection.riceItems.find().toArray()
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
