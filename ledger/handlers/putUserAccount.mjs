'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routePutUserAccount(router) {
    router.put("/user/ledger/account/:accountId", async (req, res, next) => {
        const account = req.body
        delete req.body.userId
        delete req.body.id
        await req.context.mongo.setUserAccount(req.headers.id, req.params.accountId, account)
        res.tkResponse(TKResponse.Success())
        next()
    })
}