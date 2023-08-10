'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {replaceId} from "../../common/utils.mjs";

export const routeGetSiteTemplates = (router) => {
    router.get("/site/templates", async (req, res, next) => {
        const templates = await req.context.mongo.getSiteTemplates()
        res.tkResponse(TKResponse.Success({
            data: {
                items: templates.map(replaceId)
            }
        }))
        next()
    })
}