'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetUserSites(router) {
    router.get("/user/sites", async (req, res, next) => {
        const sites = await req.context.mongo.getUserSites(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: sites
        }))
        next()
    })
}