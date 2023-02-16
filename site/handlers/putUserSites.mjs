'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routePutUserSites(router) {
    router.put('/user/site', async (req, res, next) => {
        await req.context.mongo.setUserSiteWhole(req.headers.id, req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })
}