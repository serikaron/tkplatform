'use strict'

import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {UserNotExists} from "../../common/errors/10000-user.mjs";

export const routeAlipayAccount = (router) => {
    router.put("/alipayAccount", async (req, res, next) => {
        if (!req.body.hasOwnProperty("alipayAccount") ||
            req.body.alipayAccount === "") {
            throw new InvalidArgument()
        }

        await req.context.mongo.updateAlipayAccount(req.headers.id, req.body.alipayAccount)

        res.tkResponse(TKResponse.Success())
        next()
    })

    router.get("/alipayAccount", async (req, res, next) => {
        const user = await req.context.mongo.getUserById(req.headers.id)
        if (user === null) {
            throw new UserNotExists()
        }

        res.tkResponse(TKResponse.Success({
            data: {
                alipayAccount: user.alipayAccount,
                name: user.hasOwnProperty("identification") ? user.identification.name : null
            }
        }))
        next()
    })
}