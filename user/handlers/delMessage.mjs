'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeDelMessage = router => {
    router.delete('/user/message/:messageId', async (req, res, next) => {
        await req.context.mongo.updateMessage(req.params.messageId, req.headers.id, {deleted: true})
        res.tkResponse(TKResponse.Success())
        next()
    })
}