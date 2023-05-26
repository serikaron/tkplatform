'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

const route = (router, key, collectionName) => {
    router.delete(`/${key}/entry/:entryId`, async (req, res, next) => {
        await req.context.mongo.delEntry(collectionName, req.params.entryId, req.headers.id)
        res.tkResponse(TKResponse.Success())
        next()
    })
}
export const routeDelEntry = router => {
    route(router, "ledger", "ledgerEntries")
    route(router, "journal", "withdrawJournalEntries")
}