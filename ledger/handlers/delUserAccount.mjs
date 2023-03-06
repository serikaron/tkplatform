'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

const route = (router, key, dbFnName) => {
    router.delete(`/user/${key}/account/:accountId`, async (req, res, next) => {
        await req.context.mongo[dbFnName](req.params.accountId, req.headers.id)
        res.tkResponse(TKResponse.Success())
        next()
    })
}

export const routeDelUserAccount = router => {
    route(router, "ledger", 'delUserLedgerAccount')
    route(router, 'journal', 'delUserJournalAccount')
}
