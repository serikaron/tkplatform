'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routePostUserAccount(router) {
    router.post('/user/ledger/account', async (req, res, next) => {
        const account = req.body
        account.userId = req.headers.id
        res.tkResponse(TKResponse.Success({
            data: {
                accountId: await req.context.mongo.addUserAccount(account)
            }
        }))
        next()
    })
}