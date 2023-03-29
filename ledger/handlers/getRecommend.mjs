'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetRecommend = (router) => {
    router.get('/site/:siteId/recommend', async (req, res, next) => {
        const r = await req.context.mongo.getRecommend(req.params.siteId)
        const max = Math.max(...r.map(x => x.weight))

        const data = []
        for (let i = 0; i < 24; ++i) {
            const item = r.find(x => x.hour === i)
            if (item === undefined) {
                data.push({hour: i, weight: 0})
            } else {
                data.push({hour: i, weight: Math.floor(item.weight / max * 100)})
            }
        }
        res.tkResponse(TKResponse.Success({
            data: data
        }))
        next()
    })
}