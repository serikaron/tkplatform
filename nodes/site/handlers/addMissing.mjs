'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeAddMissing = router => {
    router.post('/missing/site', async (req, res, next) => {
        await req.context.mongo.addMissing(req.headers.id, {
            missing: req.body,
            operate: {status: 0, comment: "", thumb: false}
        })
        res.tkResponse(TKResponse.Success())
        next()
    })
}