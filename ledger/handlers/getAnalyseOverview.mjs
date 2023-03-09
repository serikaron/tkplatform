'use strict'

import {dateRange} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetAnalyseOverview = router => {
    router.get('/ledger/analyse/overview/:minDate/:maxDate', async (req, res, next) => {
        const dr = dateRange(req.params.minDate, req.params.maxDate)
        const r = await req.context.mongo.getAnalyseOverview(req.headers.id, dr.minDate, dr.maxDate)
        r.exception.amount = r.exception.principle + r.exception.commission
        res.tkResponse(TKResponse.Success({
            data: r
        }))
        next()
    })
}