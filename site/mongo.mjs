'use strict'

import * as dotenv from 'dotenv'
import {connectSite} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const site = await connectSite()
    const collection = {
        sites: site.db.collection("sites"),
        userSites: site.db.collection("userSites")
    }
    req.context.mongo = {
        client: site.client, db: site.db, collection,
        getSites: async () => {
            return await collection.sites.find().toArray()
        },
        objectId: () => {
            return new ObjectId()
        },
        addUserSite: async (userId, siteId, siteInfo) => {
            siteInfo.userId = new ObjectId(userId)
            await collection.userSites.updateOne(
                {userId: new ObjectId(userId)},
                {$addToSet: {sites: siteInfo}},
                {upsert: true}
            )
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}