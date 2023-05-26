'use strict'

import {now} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

const route = (router, key, collectionName) => {
    router.post(`/${key}/entry`, async (req, res, next) => {
        const entry = req.body
        entry.userId = new ObjectId(req.headers.id)
        if (entry.createdAt === undefined) {
            entry.createdAt = now()
        }
        const entryId = await req.context.mongo.addEntry(collectionName, entry)
        res.tkResponse({
            data: {entryId}
        })
        next()
    })
}

export function routePostEntry(router) {
    route(router, "ledger", "ledgerEntries")
    route(router, "journal", "withdrawJournalEntries")
}