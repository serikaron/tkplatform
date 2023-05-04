'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {dateRange} from "../../common/utils.mjs";

export const routeGetSiteRecords = router => {
    router.get("/site/records/:minDate/:maxDate", async (req, res, next) => {
        const r = dateRange(req.params.minDate, req.params.maxDate)
        const records = await req.context.mongo.getSiteRecords(req.headers.id, req.query.userSiteId, req.query.siteId, r.minDate, r.maxDate);
        const count = await req.context.mongo.countSiteRecords(req.headers.id, req.query.userSiteId, req.query.siteId, r.minDate, r.maxDate)
        res.tkResponse(TKResponse.Success({
            data: {
                total: count,
                rate: 1000,
                list: records.map(x => {
                    x.id = x._id
                    delete x._id
                    return x
                })
            }
        }))
        next()
    })
}