'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeDelUserSite = router => {
    router.delete('/user/site/:userSiteId', async (req, res, next) => {
        await req.context.mongo.delUserSite(req.params.userSiteId, req.headers.id)
        res.tkResponse(TKResponse.Success())
        next()
    })
}