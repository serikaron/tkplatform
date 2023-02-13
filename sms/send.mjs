'use strict'

import {makeMiddleware} from "../common/flow.mjs";
import {isBadFieldString, isBadPhone} from "../common/utils.mjs";
import {InvalidArgument} from "../common/errors/00000-basic.mjs";
import {InvalidCaptcha, SendSmsFailed} from "../common/errors/30000-sms-captcha.mjs";

function checkInput(req) {
    if (isBadFieldString(req.body.phone) ||
        isBadFieldString(req.body.captcha) ||
        isBadPhone(req.body.phone)) {
        throw new InvalidArgument()
    }
}

async function checkCaptcha(req) {
    const response = await req.context.stubs.captcha.verify(req.body.captcha)
    if (response.isError()) {
        throw new InvalidCaptcha()
    }
}

async function sendCode(req, res) {
    let code = await req.context.redis.getCode(req.body.phone)
    if (code === null) {
        // code = Math.floor(Math.random() * 10000)
        code = req.context.sms.code()
        await req.context.redis.setCode(req.body.phone, code)
    }
    const sendResult = await req.context.sms.send(req.body.phone, `${code}`)
    // sendSMS(req.body.phone, `${code}`)
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