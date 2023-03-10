'use strict'


import {TKResponse} from "../../common/TKResponse.mjs";
import {dateRange, replaceId} from "../../common/utils.mjs";

const optionalFilter = (query) => {
    const {offset, limit, refundStatus, refundFrom, credited, minPrinciple, maxPrinciple, minAmount, maxAmount, ...optionalFilter} = query;

    if (refundStatus
        && Number.isInteger(Number(refundStatus))
        && Number(refundStatus) !== 0
    ) {
        optionalFilter.refundStatus = Number(refundStatus);
    }

    if (refundFrom
        && Number.isInteger(Number(refundFrom))
        && Number(refundFrom) !== 0
    ) {
        optionalFilter.refundFrom = Number(refundFrom);
    }

    if (credited
        && Number.isInteger(Number(credited))
        && Number(credited) !== 0
    ) {
        optionalFilter.credited = Number(credited);
    }

    optionalFilter.principle = {}
    if (minPrinciple && !isNaN(Number(minPrinciple))) {
        optionalFilter.principle.min = Number(minPrinciple)
    }
    if (maxPrinciple && !isNaN(Number(maxPrinciple))) {
        optionalFilter.principle.max = Number(maxPrinciple);
    }
    if (Object.keys(optionalFilter.principle).length === 0){
        delete optionalFilter.principle
    }

    optionalFilter.amount = {}
    if (minAmount && !isNaN(Number(minAmount))) {
        optionalFilter.amount.min = Number(minAmount)
    }
    if (maxAmount && !isNaN(Number(maxAmount))) {
        optionalFilter.amount.max = Number(maxAmount)
    }
    if (Object.keys(optionalFilter.amount).length === 0){
        delete optionalFilter.amount
    }

    return optionalFilter
}
const makeArguments = (req, res, next) => {
    const range = dateRange(req.params.minDate, req.params.maxDate)
    const offset = Number(req.query.offset)
    const limit = Number(req.query.limit)

    req.context.mongo.arguments = {
        userId: req.headers.id,
        minDate: range.minDate,
        maxDate: range.maxDate,
        offset: isNaN(offset) ? null : offset,
        limit: isNaN(limit) ? null : limit,
        optionalFilter: optionalFilter(req.query),
    }

    next()
}

const queryDb = (dbName) => {
    return async (req, res, next) => {
        const args = req.context.mongo.arguments
        const dbRes = await req.context.mongo.getEntries(dbName, args.userId, args.minDate, args.maxDate, args.offset, args.limit, args.optionalFilter)
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
