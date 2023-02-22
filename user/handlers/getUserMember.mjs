'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetUserMember(router) {
    router.get('/member', async (req, res, next) => {
        const user = await req.context.mongo.getUserById(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: user.member
        }))
        next()
    })
}