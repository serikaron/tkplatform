'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetWallet(router) {
    router.get("/wallet", async (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: await req.context.mongo.getWallet(req.headers.id)
        }))
        next()
    })
}