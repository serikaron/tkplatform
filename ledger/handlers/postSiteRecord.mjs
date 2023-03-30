'use strict'

import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";
import {InternalError} from "../../common/errors/00000-basic.mjs";

export const routePostSiteRecord = (router) => {
    router.post("/site/:userSiteId/record", async (req, res, next) => {
        const stubRsp = await req.context.stubs.site.getUserSite(req.headers.id, req.params.userSiteId)
        if (stubRsp.isError()) {
            throw new InternalError()
        }

        const recordId = await req.context.mongo.addSiteRecord({
            userId: new ObjectId(req.headers.id),
            userSiteId: new ObjectId(req.params.userSiteId),
            siteId: new ObjectId(stubRsp.data.site.id),
            createdAt: now(),
            principle: req.body.principle,
            commission: req.body.commission,
            kept: false,
            empty: false,
            siteName: stubRsp.data.site.name,
            account: stubRsp.data.credential.account
        })
        res.tkResponse(TKResponse.Success({ data: {recordId} }))
        next()
    })
}