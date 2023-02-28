'use strict'

import * as dotenv from 'dotenv'
import {connectSite} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";
import {now} from "../common/utils.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const site = await connectSite()
    const collection = {
        sites: site.db.collection("sites"),
        userSites: site.db.collection("userSites"),
        withdrawJournalEntries: site.db.collection("withdrawJournalEntries")
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
        },
        getUserSitesBalance: async (userId) => {
            return await collection.userSites
                .find({
                    userId: new ObjectId(userId),
                    verified: true
                }, {
                    projection: {site: 1, balance: 1}
                })
                .toArray()
        },
        setUserSiteBalance: async (userSiteId, userId, update) => {
            await collection.userSites
                .updateOne({
                    _id: new ObjectId(userSiteId),
                    userId: new ObjectId(userId),
                },{
                    $set: update
                })
        },
        addUserSiteJournalEntry: async (userId, userSiteId, entry) => {
            entry.userId = new ObjectId(userId)
            entry.userSiteId = new ObjectId(userSiteId)
            const r = await collection.withdrawJournalEntries
                .insertOne(entry)
            return r.insertedId
        },
        getUserSiteJournalEntries: async (userId, userSiteId, offset, limit) => {
            const filter = {
                userSiteId: new ObjectId(userSiteId),
                withdrewAt: {$gte: now() - 86400 * 30},
                userId: new ObjectId(userId),
            };
            const items = await collection.withdrawJournalEntries
                .find(filter)
                .sort({withdrewAt: -1})
                .skip(offset)
                .limit(limit)
                .toArray()
            const total = await collection.withdrawJournalEntries
                .countDocuments(filter)
            return {total, items}
        },
        countUserSites: async (userId) => {
            return await collection.userSites
                .countDocuments({userId: new ObjectId(userId)})
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
