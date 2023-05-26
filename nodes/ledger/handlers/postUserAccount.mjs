'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";

export function routePostUserAccount(router) {
    router.post('/user/ledger/account', async (req, res, next) => {
        const account = req.body
        account.userId = new ObjectId(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: {
                accountId: await req.context.mongo.addUserLedgerAccount(account)
            }
        }))
        next()
    })
    router.post('/user/journal/account', async (req, res, next) => {
        const account = req.body
        account.userId = new ObjectId(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: {
                accountId: await req.context.mongo.addUserJournalAccount(account)
            }
        }))
        next()
    })
}