'use strict'


import {TKResponse} from "../../common/TKResponse.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";

const checkInput = (req, res, next) => {
    if (req.query.minDate === undefined
        || req.query.maxDate === undefined) {
        throw new InvalidArgument()
    }

    const minDate = Number(req.query.minDate)
    const maxDate = Number(req.query.maxDate)
    if (isNaN(minDate) || isNaN(maxDate)) {
        throw new InvalidArgument()
    }

    const offset = Number(req.query.offset)
    const limit = Number(req.query.limit)
    req.context.mongo.arguments = {
        minDate, maxDate,
        offset: isNaN(offset) ? null : offset,
        limit: isNaN(limit) ? null : limit
    }

    next()
}

const get = async (req, res, next) => {
    const ledgerEntries = await req.context.mongo.getLedgerEntries(req.context.mongo.arguments.minDate, req.context.mongo.arguments.maxDate, req.context.mongo.arguments.offset, req.context.mongo.arguments.limit);
    res.tkResponse(TKResponse.Success({
        data: ledgerEntries
    }))
    next()
}

export function routeGetLedgerEntries(router) {
    router.get('/ledger/entries', ...[
        checkInput,
        get
    ])
}
