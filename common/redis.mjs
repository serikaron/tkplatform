'use strict'

import {createClient as createRedis} from "redis";

export function makeRedisMiddleware(url) {
    return async (req, res, next) => {
        const redis = createRedis({url})
        await redis.connect()
        if (req.context === undefined) {
            req.context = {}
        }
        req.context = {
            redis: {
                client: redis
            }
        }
        next()
    }
}

export async function cleanRedis(req, res, next) {
    await req.context.redis.client.disconnect()
    next()
}