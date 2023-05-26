'use strict'

import {InternalError} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const countSitesRecords = async (req) => {
    const r = await req.context.stubs.ledger.countSitesRecords(req.headers.id)
    if (r.isError()) {
        throw new InternalError()
    }

    req.tmpData = {sitesRecords: r.data}
}

const getSuccess = async (req) => {
    req.tmpData.successSites = await req.context.mongo.getSitesByUserSiteId(
        req.tmpData.sitesRecords.map(x => x.siteId)
    )
}

const getNotYet = async (req) => {
    req.tmpData.notYetSites = await req.context.mongo.getSitesExcept(
        req.headers.id,
        req.tmpData.successSites.map(x => x.site.id)
    )
}

const sendResponse = async (req, res) => {
    res.tkResponse(TKResponse.Success({
        data: {
            success: req.tmpData.successSites.length,
            total: req.tmpData.successSites.length + req.tmpData.notYetSites.length,
            notYetSites: req.tmpData.notYetSites.map(x => x.site)
        }
    }))
}

export const routeGetSitesStatistics = (router) => {
    router.get('/sites/statistics', makeMiddleware([
        countSitesRecords,
        getSuccess,
        getNotYet,
        sendResponse
    ]))
}