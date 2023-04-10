'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetWalletOverview = router => {
    router.get('/wallet/overview', (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: {
                income: 0,
                withdraw: 0,
                recharge: 0
            }
        }))
        next()
    })
}