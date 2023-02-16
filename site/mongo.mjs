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
        addUserSite: async (userId, userSite) => {
            await collection.userSites.updateOne(
                {userId: new ObjectId(userId)},
                {$addToSet: {sites: userSite}},
                {upsert: true}
            )
        },
        getUserSites: async (userId) => {
            return await collection.userSites.findOne(
                {userId: new ObjectId(userId)}
            )
        },
        setUserSiteOne: async (userId, siteId, site) => {
            await collection.userSites.updateOne(
                {userId: new ObjectId(userId)},
                {$set: {"sites.$[site]": site}},
                {arrayFilters: [{"site.id": new ObjectId(siteId)}]}
            )
        },
        setUserSiteWhole: async (userId, sites) => {
            await collection.userSites.updateOne(
                {userId: new ObjectId(userId)},
                {$set: {sites}}
            )
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
