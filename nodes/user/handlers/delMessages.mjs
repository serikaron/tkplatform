'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeDelMessages = router => {
    router.delete('/user/messages', async (req, res, next) => {
        await req.context.mongo.delMessages(req.headers.id)
        res.tkResponse(TKResponse.Success())
        next()
    })
}