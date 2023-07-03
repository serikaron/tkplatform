'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeAddUserMember = (router) => {
    router.post('/user/member', async (req, res, next) => {
        await req.context.mongo.addUserMember(req.body.userId, req.body.days)
        res.tkResponse(TKResponse.Success())
        next()
    })
}