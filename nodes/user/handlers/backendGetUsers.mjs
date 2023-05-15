'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {getValueNumber, replaceId} from "../../common/utils.mjs";

export const routeBackendGetUsers = router => {
    router.get('/backend/users', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = Math.min(getValueNumber(req.query, "limit", 50), 50)

        const keyword = getValueNumber(req.query, "keyword", null)
        if (keyword === null) {
            const r = await req.context.mongo.getUsers(offset, limit)
            const c = await req.context.mongo.countUsers()

            res.tkResponse(TKResponse.Success({
                data: {
                    total: c,
                    offset, limit,
                    items: r.map(replaceId)
                }
            }))
        } else {
            const r = await req.context.mongo.searchUser(req.params.keyword, offset, limit)

            res.tkResponse(TKResponse.Success({
                data: {
                    total: r.total,
                    offset, limit,
                    items: r.list.map(replaceId)
                }
            }))
        }

        next()
    })
}