'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutUserDownLine = router => {
    router.put("/downLine/:downLineUserId", async (req, res, next) => {
        await req.context.mongo.updateDownLine(req.headers.id, req.params.downLineUserId, {alias: req.body.alias})
        res.tkResponse(TKResponse.Success())
        next()
    })
}