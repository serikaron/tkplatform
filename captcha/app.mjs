'use strict'

import {create as createCaptcha, randomText} from 'svg-captcha'
import {setup} from "./setup.mjs";
import diContainer from "../common/dicontainer.mjs";
import {cleanRedis, makeRedisMiddleware} from "../common/redis.mjs";
import createApp from "../common/app.mjs";
import {Resvg} from "@resvg/resvg-js";

const app = createApp()

setup(app, {
    setup: diContainer.setup([
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
                get: async () => {
                    const captcha = createCaptcha()

                    const resvg = new Resvg(captcha.data, {})
                    const pngData = resvg.render()
                    const pngBuffer = pngData.asPng()

                    const key = randomText(4)
                    return {
                        key,
                        text: captcha.text,
                        image: pngBuffer
                    }
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