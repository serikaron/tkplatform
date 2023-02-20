'use strict'

import * as dotenv from 'dotenv'
import {connectLedger} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const ledger = await connectLedger()
    const collection = {
        ledgerEntries: ledger.db.collection("ledgerEntries")
    }
    req.context.mongo = {
        client: ledger.client, db: ledger.db, collection,
        addLedgerEntry: async (entry) => {
            const r = await collection.ledgerEntries.insertOne(entry)
            return r.insertedId
        },
        updateLedgerEntry: async (entryId, userId) => {
            await collection.ledgerEntries.updateOne(
                {
                    _id: new ObjectId(entryId),
                    userId: new ObjectId(userId)
                },
                {
                    kept: true
                }
            )
        },
        getLedgerEntries: async (minDate, maxDate, offset, limit) => {
            let query = collection.ledgerEntries
                .find({createdAt: {$gte: minDate, $lt: maxDate}})

            if (offset !== null) {
                query = query.skip(offset)
            }
            if (limit !== null) {
                query = query.limit(limit)
            }

            return await query.toArray()
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
