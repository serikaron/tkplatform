'use strict'

import {create as createCaptcha} from 'svg-captcha'
import {setup} from "./setup.mjs";
import diContainer from "../common/dicontainer.mjs";
import {cleanRedis, makeRedisMiddleware} from "../common/redis.mjs";
import createApp from "../common/app.mjs";

const app = createApp()

setup(app, {
    setup: diContainer.setup([
        makeRedisMiddleware('redis://captcha_cache'),
        (req, res, next) => {
            req.context.redis.setCaptcha = async (phone, captcha) => {
                await req.context.redis.client.set(phone, captcha, "EX", 300)
            }
            req.context.redis.getCaptcha = async () => {
                return await req.context.redis.client.get(req.body.phone)
            }
            next()
        },
        (req, res, next) => {
            req.context.captcha = {
                get: () => {
                    return createCaptcha()
                }
            }
            next()
        }
    ]),
    teardown: diContainer.teardown([
        cleanRedis
    ])
})

app.listen(8080, () => {
    console.log('captcha service started')
});