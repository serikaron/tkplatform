'use strict'

import * as dotenv from 'dotenv'
import {connectLedger} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";
import {now} from "../common/utils.mjs";

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
    }
    req.context.mongo = {
        client: ledger.client, db: ledger.db, collection,
        addLedgerEntry: async (entry) => {
            const r = await collection.ledgerEntries.insertOne(entry)
            return r.insertedId
        },
        setLedgerEntry: async (entryId, userId, update) => {
            await collection.ledgerEntries.updateOne(
                {
                    _id: new ObjectId(entryId),
                    userId: new ObjectId(userId)
                },
                {$set: update}
            )
        },
        keepALedger: async (entryId, userId) => {
            await collection.ledgerEntries.updateOne(
                {
                    _id: new ObjectId(entryId),
                    userId: new ObjectId(userId),
                    keptAt: {$exists: false}
                }, {
                    $set: {keptAt: now()}
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
        },
        addJournalEntry: async (entry) => {
            const r = await collection.withdrawJournalEntries.insertOne(entry)
            return r.insertedId
        },
        updateJournalEntry: async (entryId, userId, update) => {
            await collection.withdrawJournalEntries.updateOne(
                {_id: new ObjectId(entryId), userId: new ObjectId(userId)},
                {$set: update}
            )
        },
        getJournalEntries: async (minDate, maxDate, offset, limit) => {
            let query = collection.withdrawJournalEntries
                .find({createdAt: {$gte: minDate, $lt: maxDate}})

            if (offset !== null) {
                query = query.skip(offset)
            }
            if (limit !== null) {
                query = query.limit(limit)
            }

            return await query.toArray()
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
            return await collection.siteRecords.find({
                    userId: new ObjectId(userId),
                    siteId: new ObjectId(siteId),
                    createdAt: {$gte: minDate, $lt: maxDate},
                }
            ).toArray()
        },
        addSiteRecord: async (record) => {
            const r = await collection.siteRecords.insertOne(record)
            return r.insertedId
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
