'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";

export const routeGetReports = router => {
    router.get('/user/reports', async (req, res, next) => {
        const r = await req.context.mongo.getReports(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: r.map(x => {
                replaceId(x)
                delete x.userId
                return x
            })
        }))
        next()
    })
}