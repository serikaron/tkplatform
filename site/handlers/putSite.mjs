'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {flattenObject} from "../../common/utils.mjs";

export const routePutSite = router => {
    router.put('/site/:siteId', async (req, res, next) => {
        delete req.body.id
        const update = flattenObject(req.body)
        await req.context.mongo.updateSite(req.params.siteId, update)
        res.tkResponse(TKResponse.Success())
        next()
    })
}