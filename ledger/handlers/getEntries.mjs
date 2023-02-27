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

const queryDb = (dbName) => {
    return async (req, res, next) => {
        const args = req.context.mongo.arguments
        const dbRes = await req.context.mongo.getEntries(dbName, args.userId, args.minDate, args.maxDate, args.offset, args.limit)
        dbRes.items.forEach(x => {
            replaceId(x)
            delete x.userId
        })
        res.tkResponse(TKResponse.Success({
            data: dbRes
        }))
        next()
    }
}

const route = (router, key, dbName) => {
    router.get(`/${key}/entries/:minDate/:maxDate`, ...[
        makeArguments,
        queryDb(dbName)
    ])
}

export function routeGetEntries(router) {
    route(router, "ledger", "ledgerEntries")
    route(router, "journal", "withdrawJournalEntries")
}
