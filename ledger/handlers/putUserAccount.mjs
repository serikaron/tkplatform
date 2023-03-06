'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routePutUserAccount(router) {
    router.put("/user/ledger/account/:accountId", async (req, res, next) => {
        const account = req.body
        delete req.body.userId
        delete req.body.id
        await req.context.mongo.setUserLedgerAccount(req.params.accountId, req.headers.id, account)
        res.tkResponse(TKResponse.Success())
        next()
    })
    router.put("/user/journal/account/:accountId", async (req, res, next) => {
        const account = req.body
        delete req.body.userId
        delete req.body.id
        await req.context.mongo.setUserJournalAccount(req.params.accountId, req.headers.id, account)
        res.tkResponse(TKResponse.Success())
        next()
    })
}