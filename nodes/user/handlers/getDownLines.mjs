'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetDownLines = router => {
    router.get("/user/downLines", async (req, res, next) => {
        const downLines = await req.context.mongo.getDownLines(req.headers.id)
        // console.log(`downlines: ${JSON.stringify(downLines)}`)
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
            for (const downLine of downLines) {
                const info = await req.context.mongo.getDownLineInfo(downLine.id)
                Object.assign(downLine, info)
                if (!downLine.hasOwnProperty("alias")) {
                    downLine.alias = ""
                }
                if (!downLine.hasOwnProperty("claimed")) {
                    downLine.claimed = false
                }
                downLine.lastLoginAt = 0
            }
            res.tkResponse(TKResponse.Success({
                data: {
                    withdraw: 0,
                    total: downLines.length,
                    items: downLines
                }
            }))
        }
        next()
    })
}