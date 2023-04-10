'use strict'

import {dateToTimestamp, isBadFieldString} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const pickYear = (req) => {
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
    if (!req.query.hasOwnProperty("month")) {
        return
    }

    const monthList = req.query.month.split(",")
    if (monthList.length === 12) {
        return
    }

    const isInvalidMonth = (m) => {
        return isNaN(m) || m <= 0 || m > 12
    }

    const l = monthList.map(Number)
    const invalid = l.filter(isInvalidMonth).length > 0
    if (invalid) {
        throw new InvalidArgument()
    }
    req.input.month = l
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

const deleteYearMonth = async (req, res, collectionName) => {
    await pickYear(req)
    await pickMonth(req)
    await convertDate(req)
    const f = updateDb(collectionName)
    await f(req)
    await response(req, res)
}

const deleteImport = async (req, res) => {
    await req.context.mongo.delImportEntries(req.headers.id)
    await response(req, res)
}

export const routeDelEntries = router => {
    router.delete('/ledger/entries', async (req, res, next) => {
        if (req.query.hasOwnProperty("import")) {
            await deleteImport(req, res)
        } else {
            await deleteYearMonth(req, res, "ledgerEntries")
        }
        next()
    })

    router.delete('/journal/entries', async (req, res, next) => {
        await deleteYearMonth(req, res, "withdrawJournalEntries")
        next()
    })
}