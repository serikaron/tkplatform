'use strict'

import {flattenObject} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutTemplate = router => {
    router.put('/ledger/template/:templateId', async (req, res, next) => {
        const update = flattenObject(req.body)
        delete update.id
        await req.context.mongo.updateTemplate(req.headers.id, update)
        res.tkResponse(TKResponse.Success())
        next()
    })
}