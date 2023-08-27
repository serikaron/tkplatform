'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {addPaymentRecordAdmin, addRiceRecordAdmin} from "../backendRecords.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {parseMoney} from "../../common/utils.mjs";

export const routePostWallet = router => {
    router.post("/wallet", async (req, res, next) => {
        console.log(`wallet: ${JSON.stringify(req.body)}`)
        await req.context.mongo.updateWallet(req.headers.id, req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })

    router.post("/wallet/cash", async (req, res, next) => {
        const cash = parseMoney(req.body.cash)
        if (isNaN(cash)) {
            throw new InvalidArgument()
        }

        await req.context.mongo.addCash(req.body.userId, cash)
        await req.context.mongo.incIncome(req.body.userId, cash)
        await addPaymentRecordAdmin(req.context, req.body.userId, cash)

        res.tkResponse(TKResponse.Success())
        next()
    })

    router.post("/wallet/rice", async (req, res, next) => {
        const rice = Number(req.body.rice)
        if (isNaN(rice)) {
            throw new InvalidArgument()
        }

        await req.context.mongo.addRice(req.body.userId, rice)
        await addRiceRecordAdmin(req.context, req.body.userId, rice)

        res.tkResponse(TKResponse.Success())
        next()
    })
}
