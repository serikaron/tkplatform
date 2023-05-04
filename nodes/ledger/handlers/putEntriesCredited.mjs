'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePutEntriesCredited = router => {
    router.put('/journal/entries/credited', async (req, res, next) => {
        await req.context.mongo.setEntriesCredited(req.headers.id)
        res.tkResponse(TKResponse.Success())
        next()
    })
}