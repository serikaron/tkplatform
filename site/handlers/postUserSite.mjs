'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routePostUserSite(router) {
    router.post('/user/site', async (req, res, next) => {
        req.body.id = req.context.mongo.objectId()
        await req.context.mongo.addUserSite(req.headers.id, req.body)
        res.tkResponse(TKResponse.Success({
            data: req.body
        }))
        next()
    })
}