'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetRecommend = (router) => {
    let recommend = []
    for (let i = 0; i < 24; i++) {
        recommend.push({
            hour: i,
            weight: Math.floor(Math.random() * 100)
        })
    }
    router.get('/site/:userSiteId/recommend', async (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: recommend
        }))
        next()
    })
}