'use strict'

import * as dotenv from 'dotenv'
import {connectLedger} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";
import {dateToTimestamp} from "../common/utils.mjs";

dotenv.config()

class Filter {
    constructor() {
        this._filter = {}
    }

    static generalFilter(userId, minDate, maxDate) {
        const filter = new Filter()
        return filter
            .userId(userId)
            .createdAt(minDate, maxDate)
            .notDeleted()
    }

    get filter() {
        return this._filter
    }

    userId(id) {
        this._filter.userId = new ObjectId(id)
        return this
    }

    createdAt(minDate, maxDate) {
        this._filter.createdAt = {$gte: minDate, $lt: maxDate}
        return this
    }

    notDeleted() {
        this._filter.deleted = {$ne: true}
        return this
    }

    plug(filter) {
        Object.assign(this._filter, filter)
        return this
    }

    toFilter() {
        return this._filter
    }

    toMatch() {
        return {$match: this._filter}
    }
}

class Aggregate {
    static get exceptionCond() {
        return {$eq: ["$status", 1]}
    }

    static amount(field) {
        return {$toLong: field}
    }

    static notYetRefunded(field) {
        return {$ne: [field, true]}
    }

    static get principleBase() {
        return {
            amount: Aggregate.amount("$principle.amount"),
            notYetCond: Aggregate.notYetRefunded("$principle.refunded")
        }
    }

    static get commissionBase() {
        return {
            amount: Aggregate.amount("$commission.amount"),
            notYetCond: Aggregate.notYetRefunded("$commission.refunded")
        }
    }

    static get exception() {
        return {
            count: {
                $sum: {
                    $cond: [Aggregate.exceptionCond, 1, 0]
                }
            },
            principle: {
                $sum: {
                    $cond: [
                        Aggregate.exceptionCond,
                        Aggregate.principleBase.amount,
                        0
                    ]
                }
            },
            commission: {
                $sum: {
                    $cond: [
                        Aggregate.exceptionCond,
                        Aggregate.commissionBase.amount,
                        0
                    ]
                }
            }
        }
    }

    static get principle() {
        return {
            total: {
                $sum: Aggregate.principleBase.amount
            },
            notYetRefunded: {
                amount: {
                    $sum: {
                        $cond: [
                            Aggregate.principleBase.notYetCond,
                            Aggregate.principleBase.amount,
                            0
                        ]
                    }
                },
                count: {
                    $sum: {
                        $cond: [Aggregate.principleBase.notYetCond, 1, 0]
                    }
                }
            },
        }
    }

    static get commission() {
        return {
            total: {
                $sum: Aggregate.commissionBase.amount
            },
            notYetRefunded: {
                amount: {
                    $sum: {
                        $cond: [
                            Aggregate.commissionBase.notYetCond,
                            Aggregate.commissionBase.amount,
                            0
                        ]
                    }
                },
                count: {
                    $sum: {
                        $cond: [Aggregate.commissionBase.notYetCond, 1, 0]
                    }
                }
            }
        }
    }
}

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
        ledgerTemplates: ledger.db.collection("ledgerTemplates"),
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
        getEntries: async (collectionName, userId, minDate, maxDate, offset, limit, optionalFilter) => {
            const filter = Filter.generalFilter(userId, minDate, maxDate)
            makeOptionalFilter(filter, optionalFilter,
                collectionName === "ledgerEntries" ?
                    ["account", "ledgerAccount.account", "shop", "orderId"] :
                    ["account", "journalAccount.account", "orderId"]
            )
            const r = await ledger.db.collection(collectionName)
                .aggregate([
                    filter.toMatch(),
                    {$sort: {"createdAt": -1}},
                    {
                        $facet: {
                            items: [{$skip: offset === null ? 0 : offset}, {$limit: limit === null ? 50 : limit}],
                            count: [
                                {
                                    $count: "total"
                                }
                            ],
                        }
                    },
                    {
                        $project: {
                            total: {
                                $arrayElemAt: [
                                    "$count.total",
                                    0
                                ]
                            },
                            items: 1
                        }
                    }
                ])
                .toArray()

            console.log(JSON.stringify(r[0]))
            return r[0]
        },
        delEntries: async (collectionName, userId, from, to) => {
            await ledger.db.collection(collectionName)
                .updateMany(
                    {
                        userId: new ObjectId(userId),
                        createdAt: {$gte: from, $lt: to}
                    },
                    {$set: {deleted: true}}
                )
        },
        delImportEntries: async (userId) => {
            await ledger.db.collection('ledgerEntries')
                .updateMany(
                    {
                        userId: new ObjectId(userId),
                        import: true,
                    },
                    {$set: {deleted: true}}
                )
        },
        getEntry: async (collectionName, entryId, userId) => {
            return await ledger.db.collection(collectionName)
                .findOne({
                    _id: new ObjectId(entryId),
                    userId: new ObjectId(userId),
                    deleted: {$ne: true}
                })
        },
        delEntry: async (collectionName, entryId, userId) => {
            await ledger.db.collection(collectionName)
                .updateOne(
                    {_id: new ObjectId(entryId), userId: new ObjectId(userId)},
                    {$set: {deleted: true}}
                )
        },
        delEntriesByDate: async (userId, date) => {
            await ledger.db.collection('ledgerEntries')
                .updateMany(
                    {
                        userId: new ObjectId(userId),
                        createdAt: date
                    },
                    {$set: {deleted: true}}
                )
        },
        countEntries: async (collectionName, userId, year) => {
            console.log(`year: ${year}, timestamp: ${dateToTimestamp(year, 1, 1)} - ${dateToTimestamp(year + 1, 1, 1)}`)
            return await ledger.db.collection(collectionName)
                .aggregate([
                    {
                        $match: {
                            userId: new ObjectId(userId),
                            deleted: {$ne: true},
                            createdAt: {
                                $gte: dateToTimestamp(year, 1, 1),
                                $lt: dateToTimestamp(year + 1, 1, 1)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                $month: {
                                    date: {$toDate: {$multiply: ["$createdAt", 1000]}},
                                    timezone: "+0800"
                                },
                            },
                            count: {$sum: 1}
                        }
                    },
                    {$sort: {_id: 1}},
                    {
                        $project: {
                            _id: 0,
                            month: "$_id",
                            count: 1
                        }
                    }
                ])
                .toArray()
        },
        getLedgerStatistics: async (userId, minDate, maxDate) => {
            const pipeline = [
                {
                    $match: {
                        userId: new ObjectId(userId),
                        createdAt: {$gte: minDate, $lt: maxDate},
                        deleted: {$ne: true}
                    }
                },
                {
                    $group: {
                        _id: null,
                        principle: {$sum: {$toLong: "$principle.amount"}},
                        commission: {$sum: {$toLong: "$commission.amount"}},
                        notYetRefunded: {
                            $sum: {
                                $add: [
                                    {
                                        $cond: [
                                            {$eq: ["$principle.refunded", false]},
                                            {$toLong: "$principle.amount"},
                                            0
                                        ]
                                    },
                                    {
                                        $cond: [
                                            {$eq: ["$commission.refunded", false]},
                                            {$toLong: "$commission.amount"},
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
                            createdAt: {$gte: minDate, $lt: maxDate},
                            deleted: {$ne: true}
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            principle: {$sum: {$toLong: "$principle.amount"}}
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
                        createdAt: {$gte: minDate, $lt: maxDate},
                        deleted: {$ne: true}
                    }
                },
                {
                    $group: {
                        _id: null,
                        notYetCredited: {
                            $sum: {
                                $cond: [
                                    {$eq: ["$credited", false]},
                                    {$toLong: "$amount"},
                                    0
                                ]
                            }
                        },
                        credited: {
                            $sum: {
                                $cond: [
                                    {$eq: ["$credited", true]},
                                    {$toLong: "$amount"},
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
        setEntriesRefunded: async (userId) => {
            await collection.ledgerEntries
                .updateMany(
                    {userId: new ObjectId(userId)},
                    {
                        $set: {
                            "principle.refunded": true,
                            "commission.refunded": true
                        }
                    }
                )
        },
        setEntriesCredited: async (userId) => {
            await collection.withdrawJournalEntries
                .updateMany(
                    {userId: new ObjectId(userId)},
                    {$set: {credited: true}}
                )
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
            return await collection.userLedgerAccounts.find({
                userId: new ObjectId(userId),
                deleted: {$ne: true}
            }).toArray()
        },
        getUserJournalAccounts: async (userId) => {
            return await collection.userJournalAccounts.find({
                userId: new ObjectId(userId),
                deleted: {$ne: true}
            }).toArray()
        },
        addUserLedgerAccount: async (account) => {
            const r = await collection.userLedgerAccounts.insertOne(account)
            return r.insertedId
        },
        addUserJournalAccount: async (account) => {
            const r = await collection.userJournalAccounts.insertOne(account)
            return r.insertedId
        },
        setUserLedgerAccount: async (accountId, userId, account) => {
            await collection.userLedgerAccounts
                .updateOne(
                    {_id: new ObjectId(accountId), userId: new ObjectId(userId)},
                    {$set: account}
                )
        },
        setUserJournalAccount: async (accountId, userId, account) => {
            await collection.userJournalAccounts
                .updateOne(
                    {_id: new ObjectId(accountId), userId: new ObjectId(userId)},
                    {$set: account}
                )
        },
        delUserLedgerAccount: async (accountId, userId) => {
            await collection.userLedgerAccounts.updateOne(
                {_id: new ObjectId(accountId), userId: new ObjectId(userId)},
                {$set: {deleted: true}}
            )
        },
        delUserJournalAccount: async (accountId, userId) => {
            await collection.userJournalAccounts.updateOne(
                {_id: new ObjectId(accountId), userId: new ObjectId(userId)},
                {$set: {deleted: true}}
            )
        },
        getSiteRecords: async (userId, userSiteId, siteId, minDate, maxDate) => {
            const filter = new Filter()
            filter.userId(userId)
                .createdAt(minDate, maxDate)
                .notDeleted()
            if (userSiteId !== undefined) {
                filter.plug({userSiteId: new ObjectId(userSiteId)})
            }
            if (siteId !== undefined) {
                filter.plug({siteId: new ObjectId(siteId)})
            }
            return await collection.siteRecords.find(filter.toFilter())
                .sort({createdAt: -1})
                .toArray()
        },
        countSiteRecords: async (userId, userSiteId, siteId, minDate, maxDate) => {
            const filter = new Filter()
            filter.userId(userId)
                .createdAt(minDate, maxDate)
                .notDeleted()
            if (userSiteId !== undefined) {
                filter.plug({userSiteId: new ObjectId(userSiteId)})
            }
            if (siteId !== undefined) {
                filter.plug({siteId: new ObjectId(siteId)})
            }
            return await collection.siteRecords
                .countDocuments(filter.toFilter())
        },
        addSiteRecord: async (record) => {
            const r = await collection.siteRecords.insertOne(record)
            return r.insertedId
        },
        updateRecord: async (recordId, userId, userSiteId, update) => {
            await collection.siteRecords
                .updateOne({
                    _id: new ObjectId(recordId),
                    userId: new ObjectId(userId),
                    userSiteId: new ObjectId(userSiteId)
                }, {
                    $set: update
                })
        },
        delSiteRecord: async (recordId, userId, userSiteId) => {
            await collection.siteRecords
                .updateOne({
                    _id: new ObjectId(recordId),
                    userId: new ObjectId(userId),
                    userSiteId: new ObjectId(userSiteId)
                }, {
                    $set: {deleted: true}
                })
        },
        countSitesRecords: async (userId, minDate, maxDate) => {
            return await collection.siteRecords
                .aggregate([
                    Filter.generalFilter(userId, minDate, maxDate).toMatch(),
                    {
                        $group: {
                            _id: "$userSiteId",
                            count: {$sum: 1}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            siteId: "$_id",
                            count: 1
                        }
                    }
                ])
                .toArray()
        },
        addLedgerSite: async (site) => {
            const r = await collection.ledgerSites
                .insertOne(site)
            return r.insertedId
        },
        getLedgerSites: async (userId) => {
            return await collection.ledgerSites
                .find(
                    {userId: new ObjectId(userId), deleted: {$ne: true}},
                    {projection: {_id: 1, name: 1, account: 1}}
                )
                .toArray()
        },
        delLedgerSite: async (siteId, userId) => {
            await collection.ledgerSites
                .updateOne(
                    {_id: new ObjectId(siteId), userId: new ObjectId(userId)},
                    {$set: {deleted: true}}
                )
        },
        addTemplates: async (userId, templates) => {
            await collection.ledgerTemplates
                .insertOne({
                    userId: new ObjectId(userId),
                    templates,
                })
        },
        getTemplates: async (userId) => {
            return await collection.ledgerTemplates
                .findOne(
                    {userId: new ObjectId(userId)},
                    {projection: {templates: 1, _id: 0}}
                )
        },
        updateTemplate: async (userId, templateId, update) => {
            console.log(JSON.stringify(update, null, 4))
            const mongoUpdate = Object.keys(update)
                .reduce((acc, key) => {
                    const newKey = `templates.$[tmpl].${key}`
                    acc[newKey] = update[key]
                    return acc
                }, {})
            console.log(JSON.stringify(mongoUpdate, null, 4))
            await collection.ledgerTemplates
                .updateOne(
                    {userId: new ObjectId(userId)},
                    {$set: mongoUpdate},
                    {arrayFilters: [{"tmpl.id": new ObjectId(templateId)}]}
                )
        },
        getAnalyseDetail: async (userId, minDate, maxDate) => {
            const match = {
                $match: {
                    userId: new ObjectId(userId),
                    deleted: {$ne: true},
                    createdAt: {$gte: minDate, $lt: maxDate}
                }
            }
            const ledgerGroup = {
                $group: {
                    _id: "$site.id",
                    site: {$first: "$site"},
                    total: {
                        $sum: {
                            $add: [
                                {
                                    $cond: [
                                        {$eq: ["$principle.refunded", false]},
                                        {$toLong: "$principle.amount"},
                                        0
                                    ]
                                },
                                {
                                    $cond: [
                                        {$eq: ["$commission.refunded", false]},
                                        {$toLong: "$commission.amount"},
                                        0
                                    ]
                                }
                            ]
                        }
                    },
                    principle: {
                        $sum: {
                            $cond: [
                                {$eq: ["$principle.refunded", false]},
                                {$toLong: "$principle.amount"},
                                0
                            ]
                        }
                    },
                    commission: {
                        $sum: {
                            $cond: [
                                {$eq: ["$commission.refunded", false]},
                                {$toLong: "$commission.amount"},
                                0
                            ]
                        }
                    }
                }
            }
            const journalGroup = {
                $group: {
                    _id: "$site.id",
                    site: {$first: "$site"},
                    withdrawingSum: {
                        $sum: {
                            $cond: [
                                {$eq: ["$credited", false]},
                                {$toLong: "$amount"},
                                0
                            ]
                        }
                    }
                }
            }
            return {
                ledger: await collection.ledgerEntries.aggregate([match, ledgerGroup]).toArray(),
                journal: await collection.withdrawJournalEntries.aggregate([match, journalGroup]).toArray()
            }
        },
        getAnalyseOverview: async (userId, minDate, maxDate) => {
            const ledger = await collection.ledgerEntries
                .aggregate([
                    Filter.generalFilter(userId, minDate, maxDate)
                        .toMatch(),
                    {
                        $group: {
                            _id: null,
                            principleTotal: Aggregate.principle.total,
                            principleNotYetAmount: Aggregate.principle.notYetRefunded.amount,
                            principleNotYetCount: Aggregate.principle.notYetRefunded.count,
                            commissionTotal: Aggregate.commission.total,
                            commissionNotYetAmount: Aggregate.commission.notYetRefunded.amount,
                            commissionNotYetCount: Aggregate.commission.notYetRefunded.count,
                            count: {$sum: 1},
                            exceptionCount: Aggregate.exception.count,
                            exceptionPrinciple: Aggregate.exception.principle,
                            exceptionCommission: Aggregate.exception.commission,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            overview: {
                                commission: "$commissionTotal",
                                principle: "$principleTotal",
                                notYetRefunded: {$add: ["$principleNotYetAmount", "$commissionNotYetAmount"]},
                                count: "$count",
                            },
                            exception: {
                                count: "$exceptionCount",
                                principle: "$exceptionPrinciple",
                                commission: "$exceptionCommission",
                                amount: {$add: ["$exceptionPrinciple", "$exceptionCommission"]},
                            },
                            principle: {
                                notYetCount: "$principleNotYetCount",
                                notYetAmount: "$principleNotYetAmount",
                                refundedCount: {$subtract: ["$count", "$principleNotYetCount"]},
                                refundedAmount: {$subtract: ["$principleTotal", "$principleNotYetAmount"]},
                            },
                            commission: {
                                notYetCount: "$commissionNotYetCount",
                                notYetAmount: "$commissionNotYetAmount",
                                refundedCount: {$subtract: ["$count", "$commissionNotYetCount"]},
                                refundedAmount: {$subtract: ["$commissionTotal", "$commissionNotYetAmount"]},
                            },
                        }
                    }
                ])
                .toArray()

            const journal = await collection.withdrawJournalEntries
                .aggregate([
                    Filter.generalFilter(userId, minDate, maxDate).toMatch(),
                    {
                        $group: {
                            _id: "$journalAccount.id",
                            journalAccount: {$first: "$journalAccount"},
                            notYetCredited: {
                                $sum: {
                                    $cond: [
                                        {$ne: ["$credited", true]},
                                        {$toLong: "$amount"},
                                        0
                                    ]
                                }
                            },
                            credited: {
                                $sum: {
                                    $cond: [
                                        {$ne: ["$credited", true]},
                                        0,
                                        {$toLong: "$amount"}
                                    ]
                                }
                            },
                            count: {$sum: 1}
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalNotYet: {$sum: "$notYetCredited"},
                            totalCredited: {$sum: "$credited"},
                            totalCount: {$sum: "$count"},
                            items: {
                                $push: {
                                    journalAccount: "$journalAccount",
                                    notYetCredited: "$notYetCredited",
                                    credited: "$credited",
                                    count: "$count"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            total: {
                                notYetCredited: "$totalNotYet",
                                credited: "$totalCredited",
                                count: "$totalCount"
                            },
                            items: {
                                journalAccount: 1,
                                notYetCredited: 1,
                                credited: 1,
                                count: 1,
                            }
                        }
                    }
                ])
                .toArray()

            // console.log(`overview, ledger: ${JSON.stringify(ledger)}`)
            // console.log(`overview, ledger: ${JSON.stringify(journal)}`)
            return {
                overview: ledger.length !== 0 ? ledger[0].overview : {
                    commission: 0,
                    principle: 0,
                    notYetRefunded: 0,
                    count: 0,
                },
                exception: ledger.length !== 0 ? ledger[0].exception : {
                    count: 0,
                    principle: 0,
                    commission: 0,
                    amount: 0,
                },
                commission: ledger.length !== 0 ? ledger[0].commission : {
                    notYetCount: 0,
                    notYetAmount: 0,
                    refundedCount: 0,
                    refundedAmount: 0,
                },
                principle: ledger.length !== 0 ? ledger[0].principle : {
                    notYetCount: 0,
                    notYetAmount: 0,
                    refundedCount: 0,
                    refundedAmount: 0,
                },
                cardDetail: journal.length !== 0 ? journal[0] : {
                    total: {
                        notYetCredited: 0,
                        credited: 0,
                        count: 0,
                    },
                    items: []
                }
            }
            // return {
            //     overview: r[0],
            //     exception: {principle: 0, commission: 0},
            //     principle: {},
            //     commission: {},
            //     creditDetail: {},
            // }
        },
        getRecommend: async (siteId) => {
            return await collection.siteRecords
                .aggregate([
                    {$match: {siteId: new ObjectId(siteId)}},
                    {
                        $group: {
                            _id: {
                                $hour: {
                                    date: {$toDate: {$multiply: ["$createdAt", 1000]}},
                                    timezone: "+0800"
                                },
                            },
                            weight: {$sum: 1}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            hour: "$_id",
                            weight: 1
                        }
                    }
                ])
                .toArray()
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}

function makeFilter(key, value, searchFields) {
    switch (key) {
        case "siteName":
            return {"site.name": value}
        case "siteId":
            return {"site.id": value}
        case "refundStatus": {
            switch (value) {
                case 1:
                    return {"principle.refunded": true, "commission.refunded": true}
                case 2:
                    return {$or: [{"principle.refunded": false}, {"commission.refunded": false}]}
                case 3:
                    return {"principle.refunded": false}
                case 4:
                    return {"commission.refunded": false}
                default:
                    return null
            }
        }
        case "refundFrom": {
            return {"refund.from": value - 1}
        }
        case "storeId":
            return {"store.id": value}
        case "key":
            const regex = `.*${value}.*`
            return {
                $or: searchFields.map(x => {
                    return {[x]: {$regex: regex}}
                })
            }
        case "principle":
            if ("min" in value && "max" in value) {
                return {
                    $expr: {
                        $and: [
                            {$gte: [Aggregate.principleBase.amount, value.min]},
                            {$lte: [Aggregate.principleBase.amount, value.max]},
                        ]
                    }
                }
            } else if ("min" in value) {
                return {$expr: {$gte: [Aggregate.principleBase.amount, value.min]}}
            } else if ("max" in value) {
                return {$expr: {$lte: [Aggregate.principleBase.amount, value.max]}}
            } else {
                return null
            }
        case "status":
            return {"status": value - 1}
        case "credited":
            return {"credited": value === 1}
        case "amount":
            if ("min" in value && "max" in value) {
                return {
                    $expr: {
                        $and: [
                            {$gte: [Aggregate.amount("$amount"), value.min]},
                            {$lte: [Aggregate.amount("$amount"), value.max]},
                        ]
                    }
                }
            } else if ("min" in value) {
                return {$expr: {$gte: [Aggregate.amount("$amount"), value.min]}}
            } else if ("max" in value) {
                return {$expr: {$lte: [Aggregate.amount("$amount"), value.max]}}
            } else {
                return null
            }
    }
    return null
}

function makeOptionalFilter(filter, optionalFilter, searchFields) {
    Object.entries(optionalFilter).forEach(x => {
        const f = makeFilter(x[0], x[1], searchFields)
        if (f !== null) {
            filter.plug(f)
        }
    })
}
