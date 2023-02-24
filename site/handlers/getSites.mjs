'use strict'

export function routeGetSite(router) {
    router.get('/sites', async (req, res, next) => {
        const sites = await req.context.mongo.getSites()
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