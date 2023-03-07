'use strict'

import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {isBadFieldString} from "../../common/utils.mjs";

const route = (router, key, collectionName) => {
    router.get(`/${key}/entries/count`, async (req, res, next) => {
        if (isBadFieldString(req.query.year)) {
            throw new InvalidArgument()
        }

        const year = Number(req.query.year)
        if (isNaN(year)) {
            throw new InvalidArgument()
        }

        const r = await req.context.mongo.countEntries(collectionName, req.headers.id, year)
        const counts = r.map(x => {
            return {
                month: x._id,
                count: x.count
            }
        })

        res.tkResponse(TKResponse.Success({data: counts}))

        next()
    })
}

export const routeCountEntries = router => {
    route(router, "ledger", "ledgerEntries")
    route(router, "journal", "withdrawJournalEntries")
}