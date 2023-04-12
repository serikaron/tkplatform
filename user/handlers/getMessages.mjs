'use strict'

import {getValueNumber, replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const routeGetUserMessages = router => {
    router.get('/user/messages', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)

        const r = await req.context.mongo.getMessages(req.headers.id, offset, limit)
        const c = await req.context.mongo.countMessages(req.headers.id)

        res.tkResponse(TKResponse.Success({
            data: {
                total: c,
                items: r.map(replaceId)
            }
        }))

        next()
    })
}

const routeBackendGetUserMessages = router => {
    router.get('/v1/backend/user/messages', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)

        const r = await req.context.mongo.backendGetMessages(req.headers.id, offset, limit)
        const c = await req.context.mongo.backendCountMessages(req.headers.id)

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
export const routeGetMessages = router => {
    routeGetUserMessages(router)
    routeBackendGetUserMessages(router)
}