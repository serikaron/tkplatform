'use strict'

import {InternalError, NotFound} from "../../common/errors/00000-basic.mjs";
import {PasswordNotMatch} from "../../common/errors/10000-user.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeBackendLogin = backendRouter => {
    backendRouter.post("/backend/login", async (req, res, next) => {
        const user = await req.context.mongo.getBackendUser(req.body.username)
        if (user === null) {
            throw new NotFound()
        }

        const matched = await req.context.password.verify(user.password, req.body.password)
        if (!matched) {
            throw new PasswordNotMatch()
        }

        const tokenRsp = await req.context.stubs.token.gen({id: `${user._id}`})
        if (tokenRsp.isError()) {
            throw new InternalError()
        }

        res.tkResponse(TKResponse.Success({
            data: tokenRsp.data
        }))

        next()
    })
}