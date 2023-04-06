'use strict'

import {replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetReport = router => {
    router.get('/user/report/:reportId', async (req, res, next) => {
        const r = await req.context.mongo.getReport(req.params.reportId, req.headers.id)
        replaceId(r)
        delete r.userId
        res.tkResponse(TKResponse.Success({
            data: r
        }))
        next()
    })
}