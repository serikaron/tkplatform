'use strict'

import {dateRange} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetJournalStatistics = (router) => {
    router.get('/journal/statistics/:minDate/:maxDate', async (req, res, next) => {
        const d = dateRange(req.params.minDate, req.params.maxDate)
        const s = await req.context.mongo.getJournalStatistics(req.headers.id, d.minDate, d.maxDate)

        let data = {}
        if (s.length === 1) {
            const p = await req.context.mongo.sumLedgerPrinciple(req.headers.id, d.minDate, d.maxDate)
            if (p.length === 1) {
                data.notYetCredited = s[0].notYetCredited
                data.credited = s[0].credited
                data.principle = p[0].principle
            }
        }

        res.tkResponse(TKResponse.Success({data}))

        next()
    })
}