'use strict'

import * as dotenv from 'dotenv'
import {connectLedger} from "../common/mongo.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const ledger = await connectLedger()
    const collection = {
        entries: ledger.db.collection("entries")
    }
    req.context.mongo = {
        client: ledger.client, db: ledger.db, collection,
        addEntry: async (userId, siteId, entry) => {
            entry.userId = userId
            entry.siteId = siteId
            const r = await collection.entries.insertOne(entry)
            return r.insertedId
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
