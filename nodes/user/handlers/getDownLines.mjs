'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {getValueNumber, getValueString} from "../../common/utils.mjs";

export const routeGetDownLines = router => {
    router.get("/user/downLines", async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)
        const phone = getValueString(req.query, "phone", null)

        const downLines = await req.context.mongo.getDownLines(req.headers.id, offset, limit, phone)
        console.log(`downLines: ${JSON.stringify(downLines)}`)
        if (downLines === null
            || downLines === undefined
            || downLines === []) {
            // console.log("empty down lines")
            res.tkResponse(TKResponse.Success({
                data: {
                    withdraw: 0,
                    total: 0,
                    items: []
                }
            }))
        } else {
            const r = await req.context.mongo.getDownLineInfos(downLines.map(x => x.id), offset, limit, phone)
            console.log(`downLines: ${JSON.stringify(r)}`)
            res.tkResponse(TKResponse.Success({
                data: {
                    withdraw: 0,
                    items: r.items.map(x => {
                        if (!x.hasOwnProperty("alias")) {
                            x.alias = ""
                        }
                        if (!x.hasOwnProperty("claimed")) {
                            x.claimed = false
                        }
                        x.lastLoginAt = 0
                        return x
                    }),
                    total: r.count
                }
            }))
        }
        next()
    })
}