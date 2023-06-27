'use strict'

import {DidNotPay} from "../../common/errors/40000-payment.mjs";
import {isPayedStatus} from "../logStatus.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeCheckPayLog = (router) => {
    router.get('/log/:id/payed', async (req, res, next) => {
        const log = await req.context.mongo.getPayLog(req.params.id)
        if (log === null) {
            throw new DidNotPay(`log not found, id:${req.params.id}`)
        }

        if (!isPayedStatus(log.status)) {
            throw new DidNotPay(`invalid status:${log.status}, id:${req.params.id}`)
        }

        res.tkResponse(TKResponse.Success())
        next()
    })
}