'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";

export const routeCountSiteRecords = (router) => {
    router.get('/sites/records/count', async (req, res, next) => {
        const r = await req.context.mongo.countSitesRecords(req.headers.id, now(), now() + 86400)
        res.tkResponse(TKResponse.Success({
            data: r
        }))
        next()
    })
}