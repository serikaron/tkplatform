'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const makeUpdate = (req) => {
    req.update = req.body
    delete req.update.id
    delete req.update.userId
    delete req.update.createdAt
}

const updateDb = async (req) => {
    if (Object.keys(req.update).length !== 0) {
        await req.context.mongo.updateJournalEntry(req.params.entryId, req.headers.id, req.update)
    }
}

const allWell = (req, res) => {
    res.tkResponse(TKResponse.Success())
}

export function routePutJournalEntry(router) {
    router.put("/journal/entry/:entryId", ...makeMiddleware([
        makeUpdate,
        updateDb,
        allWell
    ]))
}