'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutSite = router => {
    router.put('/site/:siteId', async (req, res, next) => {
        await req.context.mongo.updateSite(req.params.siteId, req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })
}