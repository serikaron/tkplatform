'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutMissing = router => {
    router.put('/backend/missing/site/:siteId', async (req, res, next) => {
        console.log(`update missing ${req.params.siteId}`)
        const status = isNaN(Number(req.body.status)) ? 0 : Number(req.body.status)
        const comment = req.body.comment === null || req.body.comment === undefined ? "" : req.body.comment
        console.log(`update missing ${req.params.siteId}, status:${status}, comment:${comment}`)
        await req.context.mongo.updateMissing(req.params.siteId, status, comment)
        res.tkResponse(TKResponse.Success())
        next()
    })
}