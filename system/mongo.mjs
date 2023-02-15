'use strict'

import * as dotenv from 'dotenv'
import {connectSystem} from "../common/mongo.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const system = await connectSystem()
    const collection = {
        settings: system.db.collection("settings")
    }
    req.context.mongo = {
        client: system.client, db: system.db, collection,
        get: async (key) => {
            return await collection.settings
                .findOne({key})
        },
        set: async (key, value) => {
            return await collection.settings
                .updateOne({key}, {$set: {value}})
        },
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}