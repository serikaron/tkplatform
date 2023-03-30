'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export function routeGetWallet(router) {
    router.get("/wallet", async (req, res, next) => {
        const dbWallet = await req.context.mongo.getWallet(req.headers.id)

        const getValue = (field) => {
            if (dbWallet === null) {
                return 0
            }
            if (field in dbWallet) {
                return dbWallet[field]
            } else {
                return 0
            }
        }

        const tkWallet = {
            rice: getValue("rice"),
            cash: getValue("cash"),
            invitePoint: getValue("invitePoint")
        }
        res.tkResponse(TKResponse.Success({
            data: tkWallet
        }))
        next()
    })
}