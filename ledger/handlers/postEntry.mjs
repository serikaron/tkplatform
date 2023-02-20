'use strict'

export function routePostEntry(router) {
    router.post('/user/site/:siteId/entry', async (req, res, next) => {
        const entryId = await req.context.mongo.addEntry(req.headers.id, req.params.siteId, req.body)
        res.tkResponse({
            data: {entryId}
        })
        next()
    })
}