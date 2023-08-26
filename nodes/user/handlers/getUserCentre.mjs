'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {formatMoney} from "../../common/utils.mjs";

export const routeGetUserCentre = router => {
    router.get('/user/centre', async (req, res, next) => {
        const centre = await req.context.mongo.getUserCentre(req.headers.id)
        const idStr = centre._id.toString()
        centre.id = idStr.substring(idStr.length - 8)
        delete centre._id
        centre.notice = []
        centre.identified = centre.hasOwnProperty("identification")
        const walletRsp = await req.context.stubs.payment.getWallet(req.headers.id)
        if (walletRsp.isError()) {
            centre.wallet = {
                cash: 0,
                rice: 0
            }
        } else {
            centre.wallet = walletRsp.data
        }

        centre.wallet.cash = formatMoney(centre.wallet.cash)

        res.tkResponse(TKResponse.Success({data: centre}))

        next()
    })
}