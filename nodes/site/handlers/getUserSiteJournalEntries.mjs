'use strict'

import {replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const parse = (field, defaultValue) => {
    const num = Number(field)
    return isNaN(num) ? defaultValue : num
}
export const routeGetUserSiteJournalEntries = router => {
    router.get('/user/site/journal/entries', async (req, res, next) => {
        const offset = parse(req.query.offset, 0)
        const limit = parse(req.query.limit, 50)

        const dbRes = await req.context.mongo.getUserSiteJournalEntries(req.headers.id, offset, limit)
        dbRes.items.forEach(x => {
            replaceId(x)
            delete x.userId
        })
        res.tkResponse(TKResponse.Success({
            data: dbRes
        }))

        next()
    })
}