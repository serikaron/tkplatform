'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeAddUserSite(router) {
    router.post('/user/site', async (req, res, next) => {
        const siteId = req.context.mongo.objectId()
        await req.context.mongo.addUserSite(req.headers.id, siteId, req.body)
        res.tkResponse(TKResponse.Success({
            data: {
                newSiteId: siteId
            }
        }))
        next()
    })
}