'use strict'

import {getValueNumber, getValueString, replaceId} from "../../common/utils.mjs";

const getUserSites = router => {
    router.get('/sites', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)
        const keyword = getValueString(req.query, "keyword", null)
        const sites = await req.context.mongo.getSites(offset, limit, keyword)
        res.response({
            data: sites.map(replaceId)
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
                    items: sites.map(replaceId)
                }
            })
        } else {
            console.log(`search site with: ${keyword}`)
            const r = await req.context.mongo.searchSite(keyword, offset, limit)
            res.response({
                data: {
                    total: r.total,
                    offset, limit,
                    items: r.list.map(replaceId)
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