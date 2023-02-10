'use strict'

import {createClient as createRedis} from "redis";

export async function redisContextConstructor(req, res, next) {
        const redis = createRedis({url: 'redis://sms_cache'})
    await redis.connect()
    if (req.context === null || req.context === undefined) {
        req.context = {
            redis
        }
    } else {
        req.context.redis = redis
    }
    next()
}

export async function redisContextDestructor(req, res, next) {
    await req.context.redis.disconnect()
    next()
}