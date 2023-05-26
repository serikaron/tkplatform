'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeCountUserSites = router => {
    router.get('/user/sites/count', async (req, res, next) => {
        const count = await req.context.mongo.countUserSites(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: {
                count: count === null ? 0 : count
            }
        }))
        next()
    })
}