'use strict'

import {replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetSitesBalance = (router) => {
    router.get('/user/sites/balance', async (req, res, next) => {
        const l = await req.context.mongo.getUserSitesBalance(req.headers.id)
        l.forEach(x => {
            replaceId(x)
            delete x.userId
            if (x.balance === undefined) {
                x.balance = 0
            }
        })
        res.tkResponse(TKResponse.Success({
            data: l
        }))
        next()
    })
}