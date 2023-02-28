'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

function route(path, fnName, router) {
    router.get(path, async (req, res, next) => {
        const fn = req.context.mongo[fnName]
        const items = await fn()
        res.tkResponse(TKResponse.Success({
            data: items
        }))
        next()
    })
}

export function routeGetItems(router) {
    route("/store/member/items", "getMemberItems", router)
    route("/store/rice/items", "getRiceItems", router)
}
