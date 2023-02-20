'use strict'

import {now} from "../../common/utils.mjs";

export function routePostLedgerEntry(router) {
    router.post('/ledger/:siteId/entry', async (req, res, next) => {
        const entry = req.body
        entry.userId = req.headers.id
        entry.siteId = req.params.siteId
        entry.kept = false
        entry.createAt = now()
        const entryId = await req.context.mongo.addLedgerEntry(entry)
        res.tkResponse({
            data: {entryId}
        })
        next()
    })
}