'use strict'

import {replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetLedgerSites = router => {
    router.get('/ledger/sites', async (req, res, next) => {
        const l = await req.context.mongo.getLedgerSites(req.headers.id)
        l.forEach(replaceId)

        res.tkResponse(TKResponse.Success({
            data: l
        }))

        next()
    })
}