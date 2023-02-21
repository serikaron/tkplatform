'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetUserAccounts(router) {
    router.get("/user/ledger/accounts", async (req, res, next) => {
        const accounts = await req.context.mongo.getUserLedgerAccounts(req.headers.id);
        res.tkResponse(TKResponse.Success({
            data: accounts.map(x => {
                x.id = x._id
                x._id = undefined
                return x
            })
        }))
        next()
    })
    router.get("/user/journal/accounts", async (req, res, next) => {
        const accounts = await req.context.mongo.getUserJournalAccounts(req.headers.id);
        res.tkResponse(TKResponse.Success({
            data: accounts.map(x => {
                x.id = x._id
                x._id = undefined
                return x
            })
        }))
        next()
    })
}