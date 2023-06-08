'use strict'

import {getValueNumber} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetMissings = (router) => {
    router.get('/backend/missing/sites', async (req, res, next) => {
        console.log("backend get missing sites")
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)
        const r = await req.context.mongo.getMissings(offset, limit)

        // console.log(`missing sites rsp: ${JSON.stringify(r)}`)

        for (const x of r.items) {
            const userRsp = await req.context.stubs.user.getUser(x.userId)
            if (userRsp.isSuccess()) {
                x.phone = userRsp.data.phone
            }
        }

        res.tkResponse(TKResponse.Success({
            data: {
                total: r.count,
                items: r.items.map(x => {
                    let out = {}
                    Object.assign(out, x.missing)
                    out.id = x._id
                    out.phone = x.phone
                    return out
                }),
                offset, limit
            }
        }))

        next()
    })
}