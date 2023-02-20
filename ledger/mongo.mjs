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
        accounts: ledger.db.collection("accounts"),
        userAccounts: ledger.db.collection("userAccounts")
    }
    req.context.mongo = {
        client: ledger.client, db: ledger.db, collection,
        addLedgerEntry: async (entry) => {
            const r = await collection.ledgerEntries.insertOne(entry)
            return r.insertedId
        },
        updateLedgerEntry: async (entryId, userId, update) => {
            await collection.ledgerEntries.updateOne(
                {
                    _id: new ObjectId(entryId),
                    userId: new ObjectId(userId)
                },
                {$set: update}
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
        updateJournalEntry: async (userId, entryId, update) => {
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
        getAccounts: async () => {
            return await collection.accounts.find({}, {_id: 0}).toArray()
        },
        getUserAccounts: async (userId) => {
            return await collection.userAccounts.find({userId}).toArray()
        },
        addUserAccount: async (account) => {
            const r = await collection.userAccounts.insertOne(account)
            return r.insertedId
        },
        setUserAccount: async (userId, accountId, account) => {
            await collection.userAccounts
                .updateOne(
                    {userId: new ObjectId(userId), _id: new ObjectId(accountId)},
                    {$set: account}
                )
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
