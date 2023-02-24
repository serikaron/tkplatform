'use strict'

import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";

export const routePostSiteRecord = (router) => {
    router.post("/site/:siteId/record", async (req, res, next) => {
        const recordId = await req.context.mongo.addSiteRecord({
            userId: new ObjectId(req.headers.id),
            siteId: new ObjectId(req.params.siteId),
            createdAt: now(),
            principle: req.body.principle,
            commission: req.body.commission,
            kept: false
        })
        res.tkResponse(TKResponse.Success({ data: {recordId} }))
        next()
    })
}