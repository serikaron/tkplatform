'use strict'

import {redisContextConstructor, redisContextDestructor} from "./redis.mjs";


function injection(req, res, next) {
    res.response = ({status = 200, code = 0, msg = "success", data = {}}) => {
        req.res = {
            status,
            response: {
                code, msg, data
            }
        }
    }
    next()
}

function response(req, res) {
    res.status(req.res.status).json(req.res.response)
}
export async function handle(handler) {
    const f = async (req, res, next) => {
        await handler(req, res)
        next()
    }

    return [injection, redisContextConstructor, f, redisContextDestructor, response]
}


