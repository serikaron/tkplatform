'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {flattenObject} from "../../common/utils.mjs";

export function routePutUserSite(router) {
    router.put('/user/site/:siteId', async (req, res, next) => {
        const update = flattenObject(req.body)
        delete update.id
        console.log(`setUserSite: ${JSON.stringify(update)}`)
        await req.context.mongo.setUserSiteOne(req.headers.id, req.params.siteId, update)
        res.tkResponse(TKResponse.Success())
        next()
    })
}