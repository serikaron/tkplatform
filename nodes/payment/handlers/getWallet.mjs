'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {formatMoney} from "../../common/utils.mjs";

function route(router, path, getUserId, mapWallet) {
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
            data: mapWallet(tkWallet)
        }))
        next()
    })
}

export function routeGetWallet(router) {
    route(router, '/wallet', (req) => {
        return req.headers.id
    }, wallet => wallet);
    route(router, '/backend/user/:userId/wallet', (req) => {
        return req.params.userId
    }, (wallet) => {
        return Object.assign(wallet, {
            cash: formatMoney(wallet.cash)
        })
    })
}