'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {getValueNumber, replaceId} from "../../common/utils.mjs";

const route = router => {
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

const routeBackend = router => {
    router.get('/backend/user/reports', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)
        const r = await req.context.mongo.backendGetReports(offset, limit)
        const c = await req.context.mongo.backendCountReports()

        for (const report of r) {
            const user = await req.context.mongo.getUserById(report.userId.toString())
            report.phone = user === null ? "" : user.phone
        }

        res.tkResponse(TKResponse.Success({
            data: {
                total: c,
                offset, limit,
                items: r.map(x => {
                    replaceId(x)
                    x.handled = x.handled === true
                    return x
                })
            }
        }))
        next()
    })
}

export const routeGetReports = router => {
    route(router)
    routeBackend(router)
}
