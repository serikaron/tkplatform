'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePostSiteLogs = (router) => {
    router.post('/site/:userSiteId/logs', async (req, res, next) => {
        await req.context.mongo.addSiteLogs(req.headers.id, req.params.userSiteId, req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })
}