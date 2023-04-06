'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetWalletDetail = router => {
    router.get('/v1/wallet/detail', (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: []
        }))
        next()
    })
}