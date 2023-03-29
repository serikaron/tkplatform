'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeAddReport = router => {
    router.post('/user/site/:userSiteId/report', async (req, res, next) => {
        await req.context.mongo.addReport(req.headers.id, req.params.userSiteId, req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })
}