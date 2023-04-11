'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutMessages = router => {
    router.put('/user/messages', async (req, res, next) => {
        const update = {}
        if (req.body.hasOwnProperty("read")) {
            update.read = true
        }

        if (Object.keys(update).length !== 0) {
            await req.context.mongo.updateMessages(req.headers.id, update)
        }

        res.tkResponse(TKResponse.Success())

        next()
    })
}