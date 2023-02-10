'use strict'

import {TKError} from "../../common/error.mjs";

class CodeError extends TKError {
    constructor() {
        super({
            httpCode: 200,
            code: -200,
            msg: "验证码错误"
        });
    }
}

export function route(router) {
    router.get('/verify/code/:code/phone/:phone', async (req, res, next) => {
        const code = req.context.redis.get(req.params.phone)
        if (code === null || code !== req.params.code) {
            throw new CodeError()
        }
        next()
    })
}