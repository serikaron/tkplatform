'use strict'

import {makeMiddleware} from "../common/flow.mjs";
import {TKResponse} from "../common/TKResponse.mjs";

async function gen(req, res) {
    const captcha = await req.context.captcha.get()
    await req.context.redis.setCaptcha(captcha.key, captcha.text)

    console.log(`key: ${captcha.key}, captcha:${captcha.text}`)

    // res.type('svg')
    res.tkResponse(TKResponse.Success({
        data: {
            key: captcha.key,
            image: captcha.image,
        }
    }))
}
export function route(router) {
    router.post("/require", ...makeMiddleware([
        gen
    ]))
}