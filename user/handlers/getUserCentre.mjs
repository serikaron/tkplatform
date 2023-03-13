'use strict'

import {replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetUserCentre = router => {
    router.get('/centre', async (req, res, next) => {
        const centre = await req.context.mongo.getUserCentre(req.headers.id)
        replaceId(centre)
        centre.notice = []
        centre.identified = false
        centre.wallet = {
            cash: 0,
            rice: 0
        }

        res.tkResponse(TKResponse.Success({data: centre}))

        next()
    })
}