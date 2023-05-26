'use strict'

import {dateRange} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetLedgerStatistics = (router) => {
    router.get("/ledger/statistics/:minDate/:maxDate", async (req, res, next) => {
        const d = dateRange(req.params.minDate, req.params.maxDate)
        const s = await req.context.mongo.getLedgerStatistics(req.headers.id, d.minDate, d.maxDate)
        const data = s.length !== 1 ? {} : s[0]
        delete data._id
        res.tkResponse(TKResponse.Success({
            data,
        }))
        next()
    })
}