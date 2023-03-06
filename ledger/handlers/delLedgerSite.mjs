'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeDelLedgerSite = router => {
    router.delete('/ledger/site/:siteId', async (req, res, next) => {
        await req.context.mongo.delLedgerSite(req.params.siteId, req.headers.id)
        res.tkResponse(TKResponse.Success())
        next()
    })
}