'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {prepareSiteAccount} from "../mongo.mjs";

export function routePostSiteAccount(router) {
    router.post('/site/:siteId/account', async (req, res, next) => {
        prepareSiteAccount(req.context, req.body)
        await req.context.mongo.addSiteAccount(req.headers.id, req.params.siteId, req.body)
        res.tkResponse(TKResponse.Success({
            data: req.body
        }))
        next()
    })
}