'use strict'

import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routePostMessage = router => {
    router.post('/user/message', async (req, res, next) => {
        if (!req.body.hasOwnProperty('userId')) {
            throw new InvalidArgument()
        }

        req.body.userId = new ObjectId(req.body.userId)
        const id = await req.context.mongo.addMessage(req.body)

        res.tkResponse(TKResponse.Success({
            data: {id}
        }))

        next()
    })
}