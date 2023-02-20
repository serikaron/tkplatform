'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetAccounts(router) {
    router.get('/ledger/accounts', async (req, res, next) => {
        const accounts = await req.context.mongo.getAccounts();
        res.tkResponse(TKResponse.Success({
            data: accounts
        }))
        next()
    })
}