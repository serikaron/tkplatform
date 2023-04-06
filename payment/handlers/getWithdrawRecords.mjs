'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetWithdrawRecords = router => {
    router.get('/v1/wallet/withdraw/records', (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: {
                total: {
                    count: 0,
                    amount: 0,
                },
                items: []
            }
        }))
        next()
    })
}