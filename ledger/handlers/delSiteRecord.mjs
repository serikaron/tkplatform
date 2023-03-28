'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeDelSiteRecord = (router) => {
    router.delete('/site/:userSiteId/record/:recordId', async (req, res, next) => {
        await req.context.mongo.delSiteRecord(req.params.recordId, req.headers.id, req.params.userSiteId)
        res.tkResponse(TKResponse.Success())
        next()
    })
}