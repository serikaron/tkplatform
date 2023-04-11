'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutMessage = router => {
    router.put('/user/message/:messageId', async (req, res, next) => {
        const update = {}
        if (req.body.hasOwnProperty("read")) {
            update.read = true
        }

        if (Object.keys(update).length !== 0) {
            await req.context.mongo.updateMessage(req.params.messageId, req.headers.id, update)
        }

        res.tkResponse(TKResponse.Success())

        next()
    })
}