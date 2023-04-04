'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePostReport = router => {
    router.post('/user/report', async (req, res, next) => {
        const id = await req.context.mongo.addReport(req.headers.id, req.body)
        res.tkResponse(TKResponse.Success({
            data: {id}
        }))
        next()
    })
}