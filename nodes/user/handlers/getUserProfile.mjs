'use strict'

import {UserNotExists} from "../../common/errors/10000-user.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetUserProfile = (router) => {
    router.get('/user/:userId/profile', async (req, res, next) => {
        const user = await req.context.mongo.getUserById(req.params.userId)
        if (user === null) {
            throw new UserNotExists()
        }

        res.tkResponse(TKResponse.Success({
            data: user
        }))

        next()
    })
}