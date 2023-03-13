'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetUserCentre = router => {
    router.get('/centre', async (req, res, next) => {
        const centre = await req.context.mongo.getUserCentre(req.headers.id)
        const idStr = centre._id.toString()
        centre.id = idStr.substring(idStr.length - 8)
        delete centre._id
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