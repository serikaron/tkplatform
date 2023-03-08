'use strict'

import {dateRange} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const pickIds = (l1, l2) => {
    const idSet = new Set([
        ...l1.map(x => x._id),
        ...l2.map(x => x._id)
    ])
    return [...idSet]
}

const toObj = l => {
    return l.reduce((acc, cur) => {
        acc[cur._id] = cur
        return acc
    }, {})
}

const merge = (ledger, journal) => {
    const ids = pickIds(ledger, journal)
    const ledgerObj = toObj(ledger)
    const journalObj = toObj(journal)
    return ids.map(x => {
        return {
            site: x in ledgerObj ? ledgerObj[x].site : journalObj[x].site,
            total: x in ledgerObj ? ledgerObj[x].total : 0,
            principle: x in ledgerObj ? ledgerObj[x].principle : 0,
            commission: x in ledgerObj ? ledgerObj[x].commission : 0,
            withdrawingSum: x in journalObj ? journalObj[x].withdrawingSum : 0,
        }
    })
}
export const routeGetAnalyseDetail = router => {
    router.get('/ledger/analyse/detail/:minDate/:maxDate', async (req, res, next) => {
        const dr = dateRange(req.params.minDate, req.params.maxDate)
        const r = await req.context.mongo.getAnalyseDetail(req.headers.id, dr.minDate, dr.maxDate)
        res.tkResponse(TKResponse.Success({
            data: merge(r.ledger, r.journal)
        }))
        next()
    })
}