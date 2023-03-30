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

        const update = {}
        const kept = Number(req.body.kept)
        if (!isNaN(kept) && kept === 1) {
            update.kept = true
        }
        if (req.body.empty) {
            update.empty = true
        }

        await req.context.mongo.updateRecord(req.params.recordId, req.headers.id, req.params.userSiteId, update)

        res.tkResponse(TKResponse.Success())

        next()
    })
}