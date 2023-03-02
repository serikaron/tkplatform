'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetDownLines = router => {
    router.get("/downLines", async (req, res, next) => {
        const downLines = await req.context.mongo.getDownLines(req.headers.id)
        // console.log(`downlines: ${JSON.stringify(downLines)}`)
        if (downLines === null
            || downLines === []) {
            res.tkResponse(TKResponse.Success({
                data: {
                    total: 0,
                    items: []
                }
            }))
        } else {
            for (const downLine of downLines) {
                const info = await req.context.mongo.getDownLineInfo(downLine.id)
                Object.assign(downLine, info)
                if (downLine.alias === undefined) {
                    downLine.alias = ""
                }
                downLine.lastLoginAt = 0
            }
            res.tkResponse(TKResponse.Success({
                data: {
                    total: downLines.length,
                    items: downLines
                }
            }))
        }
        next()
    })
}