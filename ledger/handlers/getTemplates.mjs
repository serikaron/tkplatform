'use strict'

import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";

const defaultTemplate = (id, i) => {
    return {
        id,
        "name": `通用设置${i + 1}`,
        "account": true,
        "taskId": false,
        "store": true,
        "ledgerAccount": true,
        "shop": true,
        "product": false,
        "journalAccount": false,
        "refund": {
            "from": false,
            "type": false
        },
        "received": false,
        "status": true,
        "screenshot": false,
        "comment": true
    }
}

const defaultTemplates = () => {
    return [1,2,3,4,5]
        .map(_ => new ObjectId())
        .map(defaultTemplate)
}
export const routeGetTemplates = router => {
    router.get('/ledger/templates', async (req, res, next) => {
        const  dbRes = await req.context.mongo.getTemplates(req.headers.id)
        const templates = dbRes === null ?
            defaultTemplates() :
            dbRes.templates

        if (dbRes === null) {
            await req.context.mongo.addTemplates(req.headers.id, templates)
        }

        res.tkResponse(TKResponse.Success({
            data: templates
        }))
        next()
    })
}
