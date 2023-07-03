'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePostWallet = router => {
    router.post("/wallet", async (req, res, next) => {
        console.log(`wallet: ${JSON.stringify(req.body)}`)
        await req.context.mongo.updateWallet(req.headers.id, req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })

    router.post("/wallet/cash", async (req, res, next) => {
        await req.context.mongo.addCash(req.body.userId, req.body.cash)
        res.tkResponse(TKResponse.Success())
        next()
    })
}
