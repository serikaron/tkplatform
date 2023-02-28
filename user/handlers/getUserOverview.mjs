'use strict'

import {NotFound} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const getOverview = async (req) => {
    const overview = await req.context.mongo.getOverview(req.headers.id)
    if (overview === null) {
        throw new NotFound()
    }

    overview.activeDays = {
        "30": 0,
        total: 0
    }
    req.overview = overview
}

const countSite = async (req) => {
    const r = await req.context.stubs.site.countUserSites(req.headers.id)
    req.overview.siteCount = r.isError() ? 0 : r.data.count
}

const countRecharge = async req => {
    const r = await req.context.stubs.payment.countRecharge(req.headers.id)
    req.overview.rechargeCount = r.isError() ? 0 : r.data.count
}

const response = (req, res) => {
    res.tkResponse(TKResponse.Success({data: req.overview}))
}

export const routeGetUserOverview = router => {
    router.get("/overview", ...makeMiddleware([
        getOverview,
        countSite,
        countRecharge,
        response
    ]))
}