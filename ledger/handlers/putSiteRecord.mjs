'use strict'

import {isBadFieldBool, isBadFieldNumber} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutSiteRecord = router => {
    router.put("/site/:userSiteId/record/:recordId", async (req, res, next) => {
        if (isBadFieldNumber(req.body.kept)
            && isBadFieldBool(req.body.empty)
        ) {
            throw new InvalidArgument()
        }

        await req.context.mongo.keepRecord(req.params.recordId, req.headers.id, req.params.userSiteId)

        res.tkResponse(TKResponse.Success())

        next()
    })
}