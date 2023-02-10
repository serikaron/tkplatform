'use strict'

import {TKError} from "./error.mjs";


export function injection(req, res, next) {
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

export function responseHandler(req, res) {
    res.status(req.res.status).json(req.res.response)
}

export function response(req, res) {
    res.status(req.res.status).json(req.res.response)
}

export function errorHandler(error, req, res, next) {
    console.log(error)
    if (req.method === "GET") {
        console.log(`path:${req.path}, query:${JSON.stringify(req.query)}, params:${JSON.stringify(req.params)}`)
    } else {
        console.log(`path:${req.path}, body:${JSON.stringify(req.body)}`)
    }
    if (error instanceof TKError) {
        res.response({
            httpCode: error.httpCode,
            code: error.code,
            msg: error.message
        })
    } else {
        res.response({
            httpCode: 500,
            code: -1,
            msg: "Internal Server Error"
        })
    }
    next()
}

export function makeMiddleware(handlers) {
    return handlers.map(f => {
        return async (req, res, next) => {
            await f(req, res)
            next()
        }
    })
}

export async function handle(handlers) {
    return [injection, ...makeMiddleware(handlers), errorHandler, response]
}


