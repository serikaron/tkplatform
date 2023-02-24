'use strict'

import {replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetUserSite = router => {
    router.get("/user/site/:siteId", async (req, res, next) => {
        const site = await req.context.mongo.getUserSite(req.params.siteId, req.headers.id)
        delete site.userId
        replaceId(site)
        res.tkResponse(TKResponse.Success({
            data: site
        }))
        next()
    })
}