'use strict'

import {NotFound} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";
import {ObjectId} from "mongodb";

const isObjectId = (id) => {
    try {
        new ObjectId(id)
        return true
    } catch (e) {
        return false
    }
}

export const routeBackendGetUser = backendRouter => {
    backendRouter.get('/backend/user/:userId', async (req, res, next) => {
        if (!isObjectId(req.params.userId)) {
            next()
            return
        }

        const r = await req.context.mongo.getUserById(req.params.userId)
        if (r === null) {
            throw new NotFound()
        }

        res.tkResponse(TKResponse.Success({
            data: replaceId(r)
        }))

        next()
    })
}