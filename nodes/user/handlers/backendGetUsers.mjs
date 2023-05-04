'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {getValueNumber, replaceId} from "../../common/utils.mjs";

export const routeBackendGetUsers = router => {
    router.get('/backend/users', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = Math.min(getValueNumber(req.query, "limit", 50), 50)

        const r = await req.context.mongo.getUsers(offset, limit)
        const c = await req.context.mongo.countUsers()

        res.tkResponse(TKResponse.Success({
            data: {
                total: c,
                offset, limit,
                items: r.map(replaceId)
            }
        }))

        next()
    })
}