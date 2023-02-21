'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetAccounts(router) {
    router.get('/ledger/accounts', async (req, res, next) => {
        const accounts = await req.context.mongo.getLedgerAccounts();
        res.tkResponse(TKResponse.Success({
            data: accounts
        }))
        next()
    })
    router.get('/journal/accounts', async (req, res, next) => {
        const accounts = await req.context.mongo.getJournalAccounts();
        res.tkResponse(TKResponse.Success({
            data: accounts
        }))
        next()
    })
}