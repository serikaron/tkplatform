'use strict'

import {dateToTimestamp, isBadFieldString} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const pickYear = (req) => {
    console.log(JSON.stringify(req.query))
    if (isBadFieldString(req.query.year)) {
        throw new InvalidArgument()
    }

    const year = Number(req.query.year)
    if (isNaN(year)) {
        throw new InvalidArgument()
    }

    req.input = {year}
}

const pickMonth = (req) => {
    if (req.query.month === undefined) {
        return
    }

    const month = req.query.month

    const isInvalidMonth = (m) => {
        return isNaN(m) || m <= 0 || m > 12
    }

    if (Array.isArray(month)) {
        const l = month.map(Number)
        const invalid = l.filter(isInvalidMonth).length > 0
        if (invalid) {
            throw new InvalidArgument()
        }
        req.input.month = l
    } else {
        const m = Number(month)
        if (isInvalidMonth(m)) {
            throw new InvalidArgument()
        }
        req.input.month = [m]
    }
}

const convertDate = (req) => {
    if (req.input.month === undefined) {
        req.dbArguments = [{
            from: dateToTimestamp(req.input.year, 1, 1),
            to: dateToTimestamp(req.input.year + 1, 1, 1)
        }]
    } else {
        req.dbArguments = req.input.month.map(month => {
            return month === 12 ? {
                from: dateToTimestamp(req.input.year, month, 1),
                to: dateToTimestamp(req.input.year + 1, 1, 1)
            } : {
                from: dateToTimestamp(req.input.year, month, 1),
                to: dateToTimestamp(req.input.year, month + 1, 1)
            }
        })
    }
}

const updateDb = (collectionName) => {
    return async (req) => {
        for (const argument of req.dbArguments) {
            await req.context.mongo.delEntries(collectionName, req.headers.id, argument.from, argument.to)
        }
    }
}

const response = (req, res) => {
    res.tkResponse(TKResponse.Success())
}

const route = (router, key, collectionName) => {
    router.delete(`/${key}/entries`, ...makeMiddleware([
        pickYear,
        pickMonth,
        convertDate,
        updateDb(collectionName),
        response,
    ]))
}

export const routeDelEntries = router => {
    route(router, "ledger", "ledgerEntries")
    route(router, "journal", "withdrawJournalEntries")
}