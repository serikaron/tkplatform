'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

const fixHot = (site) => {
    if (!site.hasOwnProperty("rates")) {
        return
    }

    let hot = Number(site.rates.hot)
    if (isNaN(hot)) {
        hot = 0
    }

    // [0...5]
    site.rates.hot = Math.min(5, Math.max(0, hot))
}

const fixQuality = (site) => {
    if (!site.hasOwnProperty("quality")) {
        return
    }

    let quality = Number(site.rates.quality)
    if (isNaN(quality)) {
        quality = 0
    }

    site.rates.quality = Math.min(5, Math.max(0, quality))
}

export const routeAddSite = router => {
    router.post('/site', async (req, res, next) => {
        fixHot(req.body)
        fixQuality(req.body)
        const id = await req.context.mongo.addSite(req.body)
        res.tkResponse(TKResponse.Success({
            data: {id}
        }))
        next()
    })
}