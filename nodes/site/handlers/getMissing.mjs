'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetMissing = router => {
    router.get('/missing/sites', async (req, res, next) => {
        const r = await req.context.mongo.getMissing(req.headers.id)
        res.tkResponse(TKResponse.Success({
            data: {
                total: r.length,
                list: r.map(x => {
                    const out = {
                        name: x.missing.name
                    }
                    Object.assign(out, x.operate)
                    return out
                })
            }
        }))
        next()
    })
}