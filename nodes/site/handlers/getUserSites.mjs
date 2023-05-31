'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";

export function routeGetUserSites(router) {
    router.get("/user/sites", async (req, res, next) => {
        const dbRes = await req.context.mongo.getUserSites(req.headers.id)
        // console.log(`getUserSites, dbRes: ${JSON.stringify(dbRes)}`)
        for (const userSite of dbRes) {
            delete userSite.userId
            userSite.setting.schedule.forEach(s => {
                if (s.activated === undefined) {
                    s.activated = false
                }
            })
            const site = await req.context.mongo.getSite(userSite.site.id)
            // console.log(`site: ${JSON.stringify(site)}`)
            userSite.site = site
        }
        // console.log(`getUserSites, dbRes: ${JSON.stringify(dbRes)}`)
        res.tkResponse(TKResponse.Success({
            data: dbRes === null ? [] : dbRes
            // data: dbRes === null ? [] :
            //     dbRes.map(replaceId).map(x => {
            //         delete x.userId
            //         x.setting.schedule.forEach(s => {
            //             if (s.activated === undefined) {
            //                 s.activated = false
            //             }
            //         })
            //         return x
            //     })
        }))
        next()
    })
}