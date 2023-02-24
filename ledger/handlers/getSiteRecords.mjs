'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {dateRange} from "../../common/utils.mjs";

export const routeGetSiteRecords = router => {
    router.get("/site/:siteId/records/:minDate/:maxDate", async (req, res, next) => {
        const r = dateRange(req.params.minDate, req.params.maxDate)
        res.tkResponse(TKResponse.Success({
            data: await req.context.mongo.getSiteRecords(req.headers.id, req.params.siteId, r.minDate, r.maxDate)
        }))
        next()
    })
}