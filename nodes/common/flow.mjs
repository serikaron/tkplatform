'use strict'

import {TKError} from "./errors/error.mjs";


export function enteringLog(req, res, next) {
    console.log(`receive user:${req.headers.id} request ${req.method} ${req.url} query:${JSON.stringify(req.query)} body:${JSON.stringify(req.body)}`)
    next()
}

export function injection(req, res, next) {
    res.response = ({status = 200, code = 0, msg = "success", data = {}}) => {
        console.log(`response user:${req.headers.id} request ${req.method} ${req.url} query:${JSON.stringify(req.query)} body:${JSON.stringify(req.body)} response:${JSON.stringify(data)}`)
        req.res = {
            status,
            response: {
                code, msg, data
            }
        }
    }
    res.tkResponse = (tkResponse) => {
        res.response({
            status: tkResponse.status,
            code: tkResponse.code,
            msg: tkResponse.msg,
            data: tkResponse.data
        })
    }
    next()
}

export function responseHandler(req, res) {
    try {
        // console.log(`req ${req.url}, status: ${req.res.status}`)
        if (typeof(req.res.status) == "function") {
            console.log("invalid status")
            console.log(req.res.status())
            res.status(500).end()
            return
        }
        res.status(req.res.status).json(req.res.response)
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
}

export function errorHandler(error, req, res, next) {
    console.log(`errorHeandler ${error}`)
    console.log(`error user:${req.headers.id} request ${req.method} ${req.url} query:${req.query} body:${req.body}`)
    if (error instanceof TKError) {
        // console.log(`TKError: ${error.toString()}`)
        res.response({
            status: error.status,
            code: error.code,
            msg: error.message
        })
    } else {
        res.response({
            status: 500,
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


