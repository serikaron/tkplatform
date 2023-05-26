'use strict'

import {cleanRedis, makeRedisMiddleware} from "../common/redis.mjs";
import 'express-async-errors'
import createApp from "../common/app.mjs";
import diContainer from "../common/dicontainer.mjs";
import {setup} from "./setup.mjs";
import {axiosCall} from "../common/call.mjs";
import {sendSMS} from "./smsbao.mjs";
import dotenv from 'dotenv'

dotenv.config()

// const app = express()
const app = createApp()
const port = 8080

setup(app, {
    setup: diContainer.setup([
        makeRedisMiddleware("redis://sms_cache"),
        (req, res, next) => {
            req.context.redis.getCode = async (phone) => {
                return await req.context.redis.client.get(phone)
            }
            req.context.redis.setCode = async (phone, code) => {
                await req.context.redis.client.set(phone, code, "EX", 300)
            }
            next()
        },
        (req, res, next) => {
            req.context.stubs = {
                captcha: {
                    verify: async (phone, captcha) => {
                        return await axiosCall({
                            baseURL: "http://captcha:8080",
                            url: `/v1/captcha/verify/${phone}/${captcha}`,
                            method: "GET",
                        })
                    }
                }
            }
            next()
        },
        (req, res, next) => {
            req.context.sms = {
                code: () => {
                    return Math.floor(Math.random() * 10000)
                },
                send: async (phone, code) => {
                    return await sendSMS(phone, code)
                }
            }
            next()
        }
    ]),
    teardown: diContainer.teardown([
        cleanRedis
    ])
})

app.listen(port, () => {
    console.log('sms service start')
})