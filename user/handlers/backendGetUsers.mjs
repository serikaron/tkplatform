'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {getValueNumber, replaceId} from "../../common/utils.mjs";

export const routeBackendGetUsers = router => {
    router.get('/backend/users', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = Math.min(getValueNumber(req.query, "limit", 50), 50)

        const r = await req.context.mongo.getUsers(offset, limit)

        res.tkResponse(TKResponse.Success({
            data: r.map(replaceId)
        }))

        next()
    })
}