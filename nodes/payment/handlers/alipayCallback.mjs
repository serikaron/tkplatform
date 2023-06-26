'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeAlipayCallback = (router) => {
    router.post("/alipay/callback", async (req, res, next) => {
        console.log(`alipay callback: ${JSON.stringify(req.body)}`)
        res.tkResponse(TKResponse.Success())
        next()
    })
}