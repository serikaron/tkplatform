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
        ledgerEntries: ledger.db.collection("ledgerEntries"),
        withdrawJournalEntries: ledger.db.collection("withdrawJournalEntries"),
        stores: ledger.db.collection("stores"),
        ledgerAccounts: ledger.db.collection("ledgerAccounts"),
        journalAccounts: ledger.db.collection("journalAccounts"),
        userLedgerAccounts: ledger.db.collection("userLedgerAccounts"),
        userJournalAccounts: ledger.db.collection("userJournalAccounts"),
        siteRecords: ledger.db.collection("siteRecords"),
        ledgerSites: ledger.db.collection("ledgerSites"),
    }
    req.context.mongo = {
        client: ledger.client, db: ledger.db, collection,
        addEntry: async (collectionName, entry) => {
            const r = await ledger.db.collection(collectionName).insertOne(entry)
            return r.insertedId
        },
        setEntry: async (collectionName, entryId, userId, update) => {
            await ledger.db.collection(collectionName).updateOne(
                {
                    _id: new ObjectId(entryId),
                    userId: new ObjectId(userId)
                },
                {$set: update}
            )
        },
        getEntries: async (collectionName, userId, minDate, maxDate, offset, limit) => {
            const filter = {
                userId: new ObjectId(userId),
                createdAt: {$gte: minDate, $lt: maxDate}
            };
            let query = ledger.db.collection(collectionName)
                .find(filter)

            if (offset !== null) {
                query = query.skip(offset)
            }
            if (limit !== null) {
                query = query.limit(limit)
            }

            const items = await query.sort({createdAt: -1}).toArray()
            const total = await ledger.db.collection(collectionName)
                .countDocuments(filter)

            return {total, items}
        },
        getEntry: async (collectionName, entryId, userId) => {
            return await ledger.db.collection(collectionName)
                .findOne({
                    _id: new ObjectId(entryId),
                    userId: new ObjectId(userId)
                })
        },
        getLedgerStatistics: async (userId, minDate, maxDate) => {
            const pipeline = [
                {
                    $match: {
                        userId: new ObjectId(userId),
                        createdAt: {$gte: minDate, $lt: maxDate},
                    }
                },
                {
                    $group: {
                        _id: null,
                        principle: {$sum: "$principle.amount"},
                        commission: {$sum: "$commission.amount"},
                        notYetRefunded: {
                            $sum: {
                                $add: [
                                    {
                                        $cond: [
                                            {$eq: ["$principle.refunded", false]},
                                            "$principle.amount",
                                            0
                                        ]
                                    },
                                    {
                                        $cond: [
                                            {$eq: ["$commission.refunded", false]},
                                            "$commission.amount",
                                            0
                                        ]
                                    }
                                ]
                            }
                        },
                        exceptions: {
                            $sum: {
                                $cond: [
                                    {$eq: ["$status", 1]}, 1, 0
                                ]
                            }
                        }
                    }
                },
            ];

            return await collection.ledgerEntries
                .aggregate(pipeline)
                .toArray()
        },
        sumLedgerPrinciple: async (userId, minDate, maxDate) => {
            return await collection.ledgerEntries
                .aggregate([
                    {
                        $match: {
                            userId: new ObjectId(userId),
                            createdAt: {$gte: minDate, $lt: maxDate}
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            principle: {$sum: "$principle.amount"}
                        }
                    }
                ])
                .toArray()
        },
        getJournalStatistics: async (userId, minDate, maxDate) => {
            const pipeline = [
                {
                    $match: {
                        userId: new ObjectId(userId),
                        createdAt: {$gte: minDate, $lt: maxDate}
                    }
                },
                {
                    $group: {
                        _id: null,
                        notYetCredited: {
                            $sum: {
                                $cond: [
                                    {$eq: ["$credited", false]},
                                    "$amount",
                                    0
                                ]
                            }
                        },
                        credited: {
                            $sum: {
                                $cond: [
                                    {$eq: ["$credited", true]},
                                    "$amount",
                                    0
                                ]
                            }
                        },
                    }
                }
            ]
            return await collection.withdrawJournalEntries
                .aggregate(pipeline)
                .toArray()
        },
        getStores: async () => {
            return await collection.stores.find({}, {_id: 0}).toArray()
        },
        getLedgerAccounts: async () => {
            return await collection.ledgerAccounts.find({}, {_id: 0}).toArray()
        },
        getJournalAccounts: async () => {
            return await collection.journalAccounts.find({}, {_id: 0}).toArray()
        },
        getUserLedgerAccounts: async (userId) => {
            return await collection.userLedgerAccounts.find({userId}).toArray()
        },
        getUserJournalAccounts: async (userId) => {
            return await collection.userJournalAccounts.find({userId}).toArray()
        },
        addUserLedgerAccount: async (account) => {
            const r = await collection.userLedgerAccounts.insertOne(account)
            return r.insertedId
        },
        addUserJournalAccount: async (account) => {
            const r = await collection.userJournalAccounts.insertOne(account)
            return r.insertedId
        },
        setUserLedgerAccount: async (userId, accountId, account) => {
            await collection.userLedgerAccounts
                .updateOne(
                    {userId: new ObjectId(userId), _id: new ObjectId(accountId)},
                    {$set: account}
                )
        },
        setUserJournalAccount: async (userId, accountId, account) => {
            await collection.userJournalAccounts
                .updateOne(
                    {userId: new ObjectId(userId), _id: new ObjectId(accountId)},
                    {$set: account}
                )
        },
        getSiteRecords: async (userId, siteId, minDate, maxDate) => {
            const filter = siteId === undefined ? {
                userId: new ObjectId(userId),
                createdAt: {$gte: minDate, $lt: maxDate},
            } : {
                userId: new ObjectId(userId),
                createdAt: {$gte: minDate, $lt: maxDate},
                siteId: new ObjectId(siteId),
            }
            return await collection.siteRecords.find(filter)
                .sort({creaatedAt: -1})
                .toArray()
        },
        countSiteRecords: async (userId, siteId, minDate, maxDate) => {
            const filter = siteId === undefined ? {
                userId: new ObjectId(userId),
                createdAt: {$gte: minDate, $lt: maxDate},
            } : {
                userId: new ObjectId(userId),
                createdAt: {$gte: minDate, $lt: maxDate},
                siteId: new ObjectId(siteId),
            }
            return await collection.siteRecords
                .countDocuments(filter)
        },
        addSiteRecord: async (record) => {
            const r = await collection.siteRecords.insertOne(record)
            return r.insertedId
        },
        keepRecord: async (recordId, userId, siteId) => {
            await collection.siteRecords
                .updateOne({
                    _id: new ObjectId(recordId),
                    userId: new ObjectId(userId),
                    siteId: new ObjectId(siteId)
                }, {
                    $set: {kept: true}
                })
        },
        addLedgerSite: async (site) => {
            const r = await collection.ledgerSites
                .insertOne(site)
            return r.insertedId
        },
        getLedgerSites: async (userId) => {
            return await collection.ledgerSites
                .find(
                    {userId: new ObjectId(userId)},
                    {projection: {_id: 1, name: 1, account: 1}}
                )
                .toArray()
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}