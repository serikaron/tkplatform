'use strict'

import {isBadPhone} from "../common/utils.mjs";
import {InvalidArgument} from "../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../common/flow.mjs";
import {CaptchaError} from "../common/errors/30000-sms-captcha.mjs";

function checkInput(req) {
    if (isBadPhone(req.params.phone)) {
        throw new InvalidArgument()
    }
}

async function checkCaptcha(req, res) {
    const captcha = await req.context.redis.getCaptcha(req.params.phone)
    if (captcha === null || captcha !== req.params.captcha) {
        throw new CaptchaError()
    }
    res.response({
        status: 200,
        code: 0,
        msg: "success"
    })
}

export function route(router) {
    router.get('/verify/:phone/:captcha', ...makeMiddleware([
        checkInput,
        checkCaptcha
    ]))
}