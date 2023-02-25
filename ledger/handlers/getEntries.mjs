'use strict'


import {TKResponse} from "../../common/TKResponse.mjs";
import {dateRange, replaceId} from "../../common/utils.mjs";

const makeArguments = (req, res, next) => {
    const range = dateRange(req.params.minDate, req.params.maxDate)
    const offset = Number(req.query.offset)
    const limit = Number(req.query.limit)

    req.context.mongo.arguments = {
        userId: req.headers.id,
        minDate: range.minDate,
        maxDate: range.maxDate,
        offset: isNaN(offset) ? null : offset,
        limit: isNaN(limit) ? null : limit
    }

    next()
}

const queryDb = async (dbFn, args) => {
    console.log("queryDb")
    const entries = await dbFn(args.userId, args.minDate, args.maxDate, args.offset, args.limit)
    return entries.map(replaceId)
        .map(x => {
            delete x.userId
            return x
        })
}

async function getLedger(req, res, next) {
    res.tkResponse(TKResponse.Success({
        data: await queryDb(req.context.mongo.getLedgerEntries, req.context.mongo.arguments)
    }))
    next()
}

async function getJournal(req, res, next) {
    res.tkResponse(TKResponse.Success({
        data: await queryDb(req.context.mongo.getJournalEntries, req.context.mongo.arguments)
    }))
    next()
}

export function routeGetEntries(router) {
    router.get('/ledger/entries/:minDate/:maxDate', ...[
        makeArguments,
        getLedger
    ])
    router.get('/journal/entries/:minDate/:maxDate', ...[
        makeArguments,
        getJournal
    ])
}
