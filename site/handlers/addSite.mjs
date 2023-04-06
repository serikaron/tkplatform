'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeAddSite = router => {
    router.post('/site', async (req, res, next) => {
        const id = await req.context.mongo.addSite(req.body)
        res.tkResponse(TKResponse.Success({
            data: {id}
        }))
        next()
    })
}