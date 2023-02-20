'use strict'

import {now} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";

export function routePostJournalEntry(router) {
    router.post('/journal/entry', async (req, res, next) => {
        const entry = req.body
        entry.userId = new ObjectId(req.headers.id)
        entry.createdAt = now()
        const entryId = await req.context.mongo.addJournalEntry(entry)
        res.tkResponse(TKResponse.Success({data: {entryId}}))
        next()
    })
}