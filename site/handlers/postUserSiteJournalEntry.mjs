'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePostUserSiteJournalEntry = router => {
    router.post('/user/site/:userSiteId/journal/entry', async (req, res, next) => {
        const entryId = await req.context.mongo.addUserSiteJournalEntry(req.headers.id, req.params.userSiteId, req.body)
        res.tkResponse(TKResponse.Success({
            data: {entryId}
        }))
        next()
    })
}