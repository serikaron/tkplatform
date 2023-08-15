'use strict'

import {getValueNumber, getValueString, replaceId} from "../../common/utils.mjs";
import {fixSiteTemplate} from "../helper.mjs";

const fixRates = (site) => {
    const fix = (input) => {
        const num = Number(input)
        return isNaN(num) ?
            5 :
            // Math.floor(Math.random() * 501) / 100 :
            num
    }

    if (site.hasOwnProperty("rates")) {
        site.rates.hot = fix(site.rates.hot)
        site.rates.quality = fix(site.rates.quality)
    }
    return site
}

const fixSite = (site) => {
    replaceId(site)
    fixRates(site)
    fixSiteTemplate(site)
    return site
}

const getUserSites = router => {
    router.get('/sites', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)
        const keyword = getValueString(req.query, "keyword", null)
        const sites = await req.context.mongo.getSites(offset, limit, keyword)
        res.response({
            data: sites.map(fixSite)
        })
        next()
    })
}

const getBackendSites = router => {
    router.get('/backend/sites', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)

        const keyword = getValueString(req.query, "keyword", null)
        console.log(`keyword: ${keyword}`)
        if (keyword === null || keyword === undefined) {
            const sites = await req.context.mongo.getSitesForBackend(offset, limit)
            const count = await req.context.mongo.countSitesForBackend()
            res.response({
                data: {
                    total: count,
                    offset, limit,
                    items: sites.map(fixSite)
                }
            })
        } else {
            console.log(`search site with: ${keyword}`)
            const r = await req.context.mongo.searchSite(keyword, offset, limit)
            res.response({
                data: {
                    total: r.total,
                    offset, limit,
                    items: r.list.map(fixSite)
                }
            })
        }
        next()
    })
}

export function routeGetSite(router) {
    getUserSites(router)
    getBackendSites(router)
    // route(router, '/sites', {usingDisable: 1})
    // route(router, '/backend/sites', {})
}