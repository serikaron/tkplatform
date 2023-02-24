'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";

export function routeGetUserSites(router) {
    router.get("/user/sites", async (req, res, next) => {
        const dbRes = await req.context.mongo.getUserSites(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: dbRes === null ? [] :
                dbRes.map(replaceId).map(x => {
                    delete x.userId
                    return x
                })
        }))
        next()
    })
}