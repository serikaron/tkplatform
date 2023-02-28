'use strict'

import {flattenObject} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutUserOverview = router => {
    router.put("/overview", async (req, res, next) => {
        const update = flattenObject(req.body)
        const legalKeys = [
            "name",
            "contact.qq.account",
            "contact.qq.open",
            "contact.wechat.account",
            "contact.wechat.open",
            "contact.phone.open",
        ]
        Object.keys(update).forEach(key => {
            if (!legalKeys.includes(key)) {
                delete update[key]
            }
        })
        if (update !== {}) {
            await req.context.mongo.updateOverview(req.headers.id, update)
        }
        res.tkResponse(TKResponse.Success())
        next()
    })
}