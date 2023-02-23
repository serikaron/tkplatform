'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetSiteRecords = router => {
    router.get("/site/:siteId/records", async (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: await req.context.mongo.getSiteRecords(req.headers.id, req.params.siteId)
        }))
        next()
    })
}