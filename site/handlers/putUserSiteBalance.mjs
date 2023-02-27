'use strict'

import {isBadFieldNumber} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutUserSiteBalance = (router) => {
    router.put('/user/site/:userSiteId/balance', async (req, res, next) => {
        if (isBadFieldNumber(req.body.balance)) {
            throw new InvalidArgument()
        }

        await req.context.mongo.setUserSiteBalance(req.params.userSiteId, req.headers.id, {balance: req.body.balance})

        res.tkResponse(TKResponse.Success())

        next()
    })
}
