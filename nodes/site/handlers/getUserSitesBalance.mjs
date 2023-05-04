'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {getValueString} from "../../common/utils.mjs";

const siteBalance = userSite => {
    return {
        id: userSite._id,
        site: userSite.site,
        credentialAccount: userSite.credential.account,
        credentialPassword: userSite.credential.password,
        balance: userSite.balance === undefined ? "0" : userSite.balance
    }
}

export const routeGetSitesBalance = (router) => {
    router.get('/user/sites/balance', async (req, res, next) => {
        const siteId = getValueString(req.query, "siteId", null)
        const l = await req.context.mongo.getUserSitesBalance(req.headers.id, siteId)
        res.tkResponse(TKResponse.Success({
            data: l.map(siteBalance)
        }))
        next()
    })
}