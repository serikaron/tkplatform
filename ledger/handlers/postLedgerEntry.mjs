'use strict'

import {now} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

export function routePostLedgerEntry(router) {
    router.post('/ledger/entry', async (req, res, next) => {
        const entry = req.body
        entry.userId = new ObjectId(req.headers.id)
        if (entry.createdAt === undefined) {
            entry.createdAt = now()
        }
        const entryId = await req.context.mongo.addLedgerEntry(entry)
        res.tkResponse({
            data: {entryId}
        })
        next()
    })
}