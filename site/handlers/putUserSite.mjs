'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routePutUserSite(router) {
    router.put('/user/site/:siteId', async (req, res, next) => {
        req.body.id = req.params.siteId
        await req.context.mongo.setUserSiteOne(req.headers.id, req.params.siteId, req.body)
        res.tkResponse(TKResponse.Success({
            data: req.body
        }))
        next()
    })
}