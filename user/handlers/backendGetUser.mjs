'use strict'

import {NotFound} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";

export const routeBackendGetUser = backendRouter => {
    backendRouter.get('/backend/user/:userId', async (req, res, next) => {
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