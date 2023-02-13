'use strict'

import {isBadPhone} from "../common/utils.mjs";
import {InvalidArgument} from "../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../common/flow.mjs";
import {CodeError} from "../common/errors/30000-sms.mjs";

function checkInput(req) {
    if (isBadPhone(req.params.phone)) {
        throw new InvalidArgument()
    }
    const code = Number(req.params.code)
    if (isNaN(code)) {
        throw new InvalidArgument()
    }
    req.code = code
}

async function checkCode(req, res) {
    const code = await req.context.redis.getCode(req.params.phone)
    if (code === null || code !== req.code) {
        throw new CodeError()
    }
    res.response({
        status: 200,
        code: 0,
        msg: "success"
    })
}

export function route(router) {
    router.get('/verify/:phone/:code', ...makeMiddleware([
        checkInput,
        checkCode
    ]))
}