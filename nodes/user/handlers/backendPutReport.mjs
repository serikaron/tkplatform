'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutReport = (router) => {
    router.put('/backend/report/:reportId', async (req, res, next) => {
        await req.context.mongo.backednPutReport(req.params.reportId)
        res.tkResponse(TKResponse.Success())
        next()
    })
}