'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {flattenObject} from "../../common/utils.mjs";

const makeUpdate = (req) => {
    req.update = req.body
    delete req.update.userId
    delete req.update.id
    delete req.update.createdAt
}

const updateDb = (collectionName) => {
    return async (req) => {
        // console.log(`update ledger entry: ${JSON.stringify(req.update, null, 4)}`)
        if (Object.keys(req.update).length !== 0) {
            const flatten = flattenObject(req.update)
            console.log(`updateEntry: ${JSON.stringify(flatten)}`)
            await req.context.mongo.setEntry(collectionName, req.params.entryId, req.headers.id, flatten)
        }
    }
}

const allWell = (req, res) => {
    res.tkResponse(TKResponse.Success())
}

const route = (router, key, collectionName) => {
    router.put(`/${key}/entry/:entryId`, ...makeMiddleware([
        makeUpdate,
        updateDb(collectionName),
        allWell
    ]))
}

export function routePutEntry(router) {
    route(router, "ledger", "ledgerEntries")
    route(router, "journal", "withdrawJournalEntries")
}