'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const makeUpdate = (req) => {
    req.update = req.body
    delete req.update.userId
    delete req.update.id
    delete req.update.createdAt
}

const updateDb = async (req) => {
    // console.log(`update ledger entry: ${JSON.stringify(req.update, null, 4)}`)
    if (Object.keys(req.update).length !== 0) {
        await req.context.mongo.setLedgerEntry(req.params.entryId, req.headers.id, req.update)
    }
}

const allWell = (req, res) => {
    res.tkResponse(TKResponse.Success())
}

export function routePutLedgerEntry(router) {
    router.put("/ledger/entry/:entryId", ...makeMiddleware([
        makeUpdate,
        updateDb,
        allWell
    ]))
}