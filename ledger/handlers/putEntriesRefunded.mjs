'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutEntriesRefunded = router => {
    router.put('/ledger/entries/refunded', async (req, res, next) => {
        await req.context.mongo.setEntriesRefunded(req.headers.id)
        res.tkResponse(TKResponse.Success())
        next()
    })
}