'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeBackendPutReport = (router) => {
    router.put('/backend/report/:reportId', async (req, res, next) => {
        console.log(`reportId: ${req.params.reportId}`)
        await req.context.mongo.backendPutReport(req.params.reportId)
        res.tkResponse(TKResponse.Success())
        next()
    })
}