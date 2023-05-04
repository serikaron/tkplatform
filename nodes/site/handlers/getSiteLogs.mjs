'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetSiteLogs = (router) => {
    router.get('/site/:userSiteId/logs', async (req, res, next) => {
        const r = await req.context.mongo.getSiteLogs(req.headers.id, req.params.userSiteId)
        res.tkResponse(TKResponse.Success({data: r}))
        next()
    })
}