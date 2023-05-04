'use strict'

import {InternalError} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeBackendRegister = backendRouter => {
    backendRouter.post('/backend/register', async (req, res, next) => {
        const encoded = await req.context.password.encode(req.body.password)
        const userId = await req.context.mongo.addBackendUser({
            username: req.body.username,
            password: encoded
        })
        const tokenRsp = await req.context.stubs.token.gen({id: `${userId}`})
        if (tokenRsp.isError()) {
            throw new InternalError()
        }

        res.tkResponse(TKResponse.Success({
            data: tokenRsp.data
        }))

        next()
    })
}