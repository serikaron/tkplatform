'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";

export const routeAddBackendRecord = (router) => {
    router.post("/member/record", async (req, res, next) => {
        req.body.userId = new ObjectId(req.body.userId)
        await req.context.mongo.addMemberRecord(req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })
}