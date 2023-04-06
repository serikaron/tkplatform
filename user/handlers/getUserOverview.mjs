'use strict'

import {InvalidArgument, NotFound} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {ObjectId} from "mongodb";

const getUsingId = (req) => {
    if (req.query.id === undefined) {
        req.usingId = req.headers.id
        return
    }

    try {
        const id = new ObjectId(req.query.id)
        req.usingId = `${id}`
    } catch (e) {
        throw new InvalidArgument()
    }
}

const getOverview = async (req) => {
    console.log(`usingId: ${req.usingId}`)
    const overview = await req.context.mongo.getOverview(req.usingId)
    if (overview === null) {
        throw new NotFound()
    }

    overview.activeDays = {
        "30": 0,
        total: 0
    }
    overview.contact.phone.account = overview.phone
    req.overview = overview
}

const getSites = async (req) => {
    const r = await req.context.stubs.site.getUserSites(req.usingId)
    req.overview.siteCount = r.isError() ? 0 : r.data.length
    req.overview.sites = r.isError() ? [] : r.data.map(site => {
        return {
            id: site.id,
            site: site.site
        }
    })
}

const countRecharge = async req => {
    const r = await req.context.stubs.payment.countRecharge(req.usingId)
    req.overview.rechargeCount = r.isError() ? 0 : r.data.count
}

const response = (req, res) => {
    res.tkResponse(TKResponse.Success({data: req.overview}))
}

export const routeGetUserOverview = router => {
    router.get("/user/overview", ...makeMiddleware([
        getUsingId,
        getOverview,
        getSites,
        countRecharge,
        response
    ]))
}