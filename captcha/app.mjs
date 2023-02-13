'use strict'

import {create as createCaptcha} from 'svg-captcha'
import {setup} from "./setup.mjs";
import diContainer from "../common/dicontainer.mjs";
import {cleanRedis, makeRedisMiddleware} from "../common/redis.mjs";
import createApp from "../common/app.mjs";

const app = createApp()

const logMiddleware = (req, res, next) => {
    console.log(`captch-service, handling ${req.url}`)
    next()
}

setup(app, {
    setup: diContainer.setup([
        logMiddleware,
        makeRedisMiddleware('redis://captcha_cache'),
        (req, res, next) => {
            req.context.redis.setCaptcha = async (phone, captcha) => {
                await req.context.redis.client.set(phone, captcha, "EX", 300)
            }
            req.context.redis.getCaptcha = async (phone) => {
                return await req.context.redis.client.get(phone)
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