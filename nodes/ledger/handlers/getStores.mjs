'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetStores(router) {
    router.get('/stores', async (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: await req.context.mongo.getStores()
        }))
        next()
    })
}