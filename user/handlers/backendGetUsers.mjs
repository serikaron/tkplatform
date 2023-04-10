'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";

const parse = (dict, key, def) => {
    if (!dict.hasOwnProperty(key)) {
        return def
    }

    const out = Number(dict[key])
    return isNaN(out) ? def : out
}

export const routeBackendGetUsers = router => {
    router.get('/backend/users', async (req, res, next) => {
        const offset = parse(req.query, "offset", 0)
        const limit = Math.min(parse(req.query, "limit", 50), 50)

        const r = await req.context.mongo.getUsers(offset, limit)

        res.tkResponse(TKResponse.Success({
            data: r.map(replaceId)
        }))

        next()
    })
}