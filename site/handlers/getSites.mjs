'use strict'

export function routeGetSite(router) {
    router.get('/', async (req, res, next) => {
        const sites = await req.context.mongo.getSites()
        res.response({
            data: sites
        })
        next()
    })
}