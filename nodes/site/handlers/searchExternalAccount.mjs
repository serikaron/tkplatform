'use strict'

import {DidNotPay} from "../../common/errors/40000-payment.mjs";

export const routeSearchExternalAccount = (router) => {
    router.post('/search/external/account', async (req, res, next) => {
        const checkRsp = await req.context.stubs.payment.checkPayed(req.body.orderId)
        if (checkRsp.isError()) {
            throw new DidNotPay("支付未完成")
        }

        const searchRsp = await req.context.stubs.apid.search(req.body)
        res.tkResponse(searchRsp)
        next()
    })
}