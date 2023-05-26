'use strict'

import {NotFound} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";

const route = (router, key, collectionName) => {
    router.get(`/${key}/entry/:entryId`, async (req, res, next) => {
        const entry = await req.context.mongo.getEntry(collectionName, req.params.entryId, req.headers.id)
        if (entry === null) {
            throw new NotFound()
        }

        delete entry.userId
        replaceId(entry)

        res.tkResponse(TKResponse.Success({
            data: entry
        }))

        next()
    })
}
export const routeGetEntry = (router) => {
    [
        {key: "ledger", collectionName: "ledgerEntries"},
        {key: "journal", collectionName: "withdrawJournalEntries"},
    ].forEach(config => {
        route(router, config.key, config.collectionName)
    })
}