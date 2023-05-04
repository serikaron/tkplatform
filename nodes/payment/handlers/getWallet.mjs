'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

function route(router, path, getUserId) {
    router.get(path, async (req, res, next) => {
        const dbWallet = await req.context.mongo.getWallet(getUserId(req))

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

export function routeGetWallet(router) {
    route(router, '/wallet', (req) => {
        return req.headers.id
    });
    route(router, '/backend/user/:userId/wallet', (req) => {
        return req.params.userId
    })
}