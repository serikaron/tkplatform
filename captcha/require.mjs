'use strict'

import {makeMiddleware} from "../common/flow.mjs";
import {isBadFieldString, isBadPhone} from "../common/utils.mjs";
import {InvalidArgument} from "../common/errors/00000-basic.mjs";

function checkInput(req) {
    if (isBadFieldString(req.body.phone) ||
        isBadPhone(req.body.phone)) {
        throw new InvalidArgument()
    }
}

async function gen(req, res) {
    const captcha = req.context.captcha.get()
    await req.context.redis.setCaptcha(req.body.phone, captcha.text)

    console.log(`phone: ${req.body.phone}, captcha:${captcha.text}`)

    // res.type('svg')
    res.response({
        status: 200,
        data: {
            captcha: captcha.data
        }
    })
}
export function route(router) {
    router.post("/require", ...makeMiddleware([
        checkInput, gen
    ]))
}