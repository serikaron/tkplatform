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
        withdrawJournalEntries: site.db.collection("withdrawJournalEntries"),
        siteLogs: site.db.collection('siteLogs'),
        reports: site.db.collection('reports'),
        missingSites: site.db.collection("missingSites"),
    }
    req.context.mongo = {
        client: site.client, db: site.db, collection,
        getSites: async (offset, limit, keyword) => {
            const filter = {disabled: {$ne: true}}
            if (keyword !== undefined && keyword !== null) {
                const regex = `.*${keyword}.*`
                filter.name = {$regex: regex}
            }
            return await collection.sites.find(filter)
                .skip(offset)
                .limit(limit)
                .toArray()
        },
        getSite: async objectId => {
            return await collection.sites.findOne({_id: objectId})
        },
        getSitesForBackend: async (offset, limit) => {
            return await collection.sites.find()
                .skip(offset)
                .limit(limit)
                .toArray()
        },
        countSitesForBackend: async () => {
            return await collection.sites
                .countDocuments()
        },
        addUserSite: async (userSite) => {
            const r = await collection.userSites.insertOne(userSite)
            return r.insertedId
        },
        getUserSites: async (userId) => {
            return await collection.userSites.find(
                {
                    userId: new ObjectId(userId),
                    deleted: {$ne: true}
                }
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
                userId: new ObjectId(userId),
                deleted: {$ne: true}
            })
        },
        delUserSite: async (siteId, userId) => {
            await collection.userSites.updateOne(
                {_id: new ObjectId(siteId), userId: new ObjectId(userId)},
                {$set: {deleted: true}}
            )
        },
        getUserSitesBalance: async (userId, siteId) => {
            const filter = {
                userId: new ObjectId(userId),
                verified: true
            }
            if (siteId !== null) {
                filter["site.id"] = new ObjectId(siteId)
            }
            return await collection.userSites
                .find(filter, {
                    projection: {site: 1, balance: 1, credential: 1}
                })
                .toArray()
        },
        setUserSiteBalance: async (userSiteId, userId, update) => {
            await collection.userSites
                .updateOne({
                    _id: new ObjectId(userSiteId),
                    userId: new ObjectId(userId),
                }, {
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
        getUserSiteJournalEntries: async (userId, offset, limit) => {
            const filter = {
                userId: new ObjectId(userId),
                withdrewAt: {$gte: now() - 86400 * 30},
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
        },
        getSitesByUserSiteId: async (userSiteIds) => {
            return await collection.userSites
                .aggregate([
                    {
                        $match: {
                            _id: {
                                $in: userSiteIds.map(x => new ObjectId(x))
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$site.id",
                            site: {$first: "$site"}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            site: 1
                        }
                    }
                ])
                .toArray()
        },
        getSitesExcept: async (userId, siteIds) => {
            return await collection.userSites
                .aggregate([
                    {$match: {userId: new ObjectId(userId)}},
                    {$group: {_id: "$site.id", site: {$first: "$site"}}},
                    {$match: {"site.id": {$nin: siteIds}}},
                    {$project: {_id: 0, site: 1}},
                ])
                .toArray()
        },
        addSiteLogs: async (userId, userSiteId, logs) => {
            await collection.siteLogs
                .insertMany(
                    logs.map(x => {
                        x.userId = new ObjectId(userId)
                        x.userSiteId = new ObjectId(userSiteId)
                        return x
                    })
                )
        },
        getSiteLogs: async (userId, userSiteId) => {
            return await collection.siteLogs
                .find(
                    {
                        userId: new ObjectId(userId),
                        userSiteId: new ObjectId(userSiteId),
                        loggedAt: {$gte: now() - 7 * 86400, $lte: now()},
                    },
                    {projection: {_id: 0, loggedAt: 1, content: 1}}
                )
                .sort({loggedAt: 1})
                .toArray()
        },
        syncSettings: async (userId, siteId, update) => {
            await collection.userSites
                .updateMany({
                    userId: new ObjectId(userId),
                    "site.id": siteId,
                    deleted: {$ne: true}
                }, {
                    $set: update
                })
        },
        addReport: async (userId, userSiteId, report) => {
            await collection.reports
                .insertOne({
                    userId: new ObjectId(userId),
                    userSiteId: new ObjectId(userSiteId),
                    report,
                })
        },
        addMissing: async (userId, missing) => {
            missing.userId = new ObjectId(userId)
            await collection.missingSites
                .insertOne(missing)
        },
        getMissing: async (userId) => {
            return await collection.missingSites
                .find({
                    userId: new ObjectId(userId)
                })
                .toArray()
        },
        addSite: async (site) => {
            const r = await collection.sites
                .insertOne(site)
            return r.insertedId
        },
        updateSite: async (siteId, update) => {
            await collection.sites
                .updateOne(
                    {_id: new ObjectId(siteId)},
                    {$set: update}
                )
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
