'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {prepareUserSite} from "../mongo.mjs";

export function routePostUserSite(router) {
    router.post('/user/site', async (req, res, next) => {
        prepareUserSite(req.context, req.body)
        await req.context.mongo.addUserSite(req.headers.id, req.body)
        res.tkResponse(TKResponse.Success({
            data: req.body
        }))
        next()
    })
}