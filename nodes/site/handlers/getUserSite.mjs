'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {NotFound} from "../../common/errors/00000-basic.mjs";
import {makeUserSite} from "../helper.mjs";

export const routeGetUserSite = router => {
    router.get("/user/site/:siteId", async (req, res, next) => {
        const site = await req.context.mongo.getUserSite(req.params.siteId, req.headers.id)

        if (site === null) {
            throw new NotFound()
        }

        await makeUserSite(req, site)

        res.tkResponse(TKResponse.Success({
            data: site
        }))
        next()
    })
}