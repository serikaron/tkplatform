'use strict'

import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routePostLedgerSite = router => {
    router.post("/ledger/site", async (req, res, next) => {
        const id = await req.context.mongo.addLedgerSite({
            userId: new ObjectId(req.headers.id),
            name: req.body.name,
            account: req.body.account
        })

        res.tkResponse(TKResponse.Success({
            data: {ledgerSiteId: id}
        }))

        next()
    })
}