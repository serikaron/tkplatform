'use strict'

function route(router, path, filter) {
    router.get(path, async (req, res, next) => {
        const sites = await req.context.mongo.getSites(filter)
        res.response({
            data: sites.map(x => {
                x.id = x._id
                delete x._id
                return x
            })
        })
        next()
    })
}

export function routeGetSite(router) {
    route(router, '/sites', {usingDisable: 1})
    route(router, '/backend/sites', {})
}