'use strict'

import {dateRange} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetAnalyseDetail = router => {
    router.get('/ledger/analyse/detail/:minDate/:maxDate', async (req, res, next) => {
        const dr = dateRange(req.params.minDate, req.params.maxDate)
        const r = await req.context.mongo.getAnalyseDetail(req.headers.id, dr.minDate, dr.maxDate)
        res.tkResponse(TKResponse.Success({
            data: r
        }))
        next()
    })
}