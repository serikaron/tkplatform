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
        getSite: async objectId => {
            return await collection.sites.findOne({_id: objectId})
        },
        addUserSite: async (userSite) => {
            const r = await collection.userSites.insertOne(userSite)
            return r.insertedId
        },
        getUserSites: async (userId) => {
            return await collection.userSites.find(
                {userId: new ObjectId(userId)}
            ).toArray()
        },
        setUserSiteOne: async (userId, siteId, site) => {
            await collection.userSites.updateOne({
                userId: new ObjectId(userId),
                _id: new ObjectId(siteId),
            }, {
                $set: site
            })
        },
        getUserSite: async (siteId, userId) => {
            return await collection.userSites.findOne({
                _id: new ObjectId(siteId),
                userId: new ObjectId(userId)
            })
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
