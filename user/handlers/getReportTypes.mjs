'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetReportTypes = router => {
    router.get('/report/types', (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: [
                "本App问题",
                "平台问题",
                "充值问题",
                "代理系统问题",
            ]
        }))
        next()
    })
}