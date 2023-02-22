'use strict'

import {makeMiddleware} from "../common/flow.mjs";
import {isBadFieldObject, isBadFieldString, isBadPhone} from "../common/utils.mjs";
import {InvalidArgument} from "../common/errors/00000-basic.mjs";
import {InvalidCaptcha, SendSmsFailed} from "../common/errors/30000-sms-captcha.mjs";

function checkInput(req) {
    if (isBadFieldString(req.body.phone)
        || isBadFieldObject(req.body.captcha)
        || isBadFieldString(req.body.captcha.code)
        || isBadFieldString(req.body.captcha.key)
        || isBadPhone(req.body.phone)
    ) {
        throw new InvalidArgument()
    }
}

async function checkCaptcha(req) {
    const response = await req.context.stubs.captcha.verify(req.body.captcha.key, req.body.captcha.code)
    if (response.isError()) {
        throw new InvalidCaptcha()
    }
}

async function sendCode(req, res) {
    let code = await req.context.redis.getCode(req.body.phone)
    if (code === null) {
        code = `${req.context.sms.code()}`
        await req.context.redis.setCode(req.body.phone, code)
    }
    const sendResult = await req.context.sms.send(req.body.phone, code)
    if (sendResult !== 0) {
        throw new SendSmsFailed()
    }
    res.response({
        status: 200,
        code: 0,
        msg: "发送成功"
    })
}

export function route(router) {
    router.post("/send", makeMiddleware([checkInput, checkCaptcha, sendCode]))
}