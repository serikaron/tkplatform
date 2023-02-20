'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {isGoodFieldBool} from "../../common/utils.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const makeUpdate = (req) => {
    req.update = {}
    if (isGoodFieldBool(req.body.kept) && req.body.kept) {
        req.update.kept = true
    }
    if (isGoodFieldBool(req.body.commission)) {
        req.update.commission = {refunded: req.body.commission}
    }
    if (isGoodFieldBool(req.body.principle)) {
        req.update.principle = {refunded: req.body.principle}
    }
}

const updateDb = async (req) => {
    if (Object.keys(req.update).length !== 0) {
        await req.context.mongo.updateLedgerEntry(req.params.entryId, req.headers.id, req.update)
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