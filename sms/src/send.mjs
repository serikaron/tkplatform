'use strict'

import {axiosCall} from "../../stubs/call.mjs";
import {TKError} from "../../errors/error.mjs";
import {sendSMS} from "./smsbao.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

class InvalidCaptcha extends TKError {
    constructor() {
        super({
            httpCode: 200,
            code: -200,
            msg: "图形验证码错误"
        });
    }
}

async function checkCaptcha(req) {
    const response = await axiosCall({
        baseURL: "http://captcha:8080",
        url: "/v1/captcha/verify",
        method: "POST",
        data: {
            phone: req.body.phone,
            code: req.body.captcha
        }
    })
    console.log(`chechcaptcha, response:${response.toString()}`)
    if (response.isError()) {
        throw new InvalidCaptcha()
    }
}

async function sendCode(req) {
    let code = await req.context.redis.get(req.body.phone)
    if (code === null) {
        code = Math.floor(Math.random() * 10000)
        await req.context.redis.set(req.body.phone, code, EX, 300)
    }
    sendSMS(req.body.phone, `${code}`)
}

export function route(router) {
    router.post("/send", makeMiddleware([checkCaptcha, sendCode]))
}