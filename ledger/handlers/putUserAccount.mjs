'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routePutUserAccount(router) {
    router.put("/user/ledger/account/:accountId", async (req, res, next) => {
        const account = req.body
        req.body.userId = req.headers.id
        req.body.id = undefined
        await req.context.mongo.setUserAccount(req.headers.id, req.params.accountId, account)
        res.tkResponse(TKResponse.Success())
        next()
    })
}