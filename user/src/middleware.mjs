'use strict'

import {connect as connectMongo, close as closeMongo} from "./mongo.mjs";
import {UserError} from "./error.mjs";

export async function buildContext(req, res, next) {
    const mongo = await connectMongo()
    req.context = {mongo}
    next()
}

export async function cleanContext(req, res, next) {
    await closeMongo(req.context.mongo.client)
    next()
}

export async function response(req, res) {
    res.status(req.res.httpCode).json({
        code: req.res.code,
        msg: req.res.msg,
        data: req.res.data
    })
}

export async function injection(req, res, next) {
    res.response = function ({httpCode = 200, code = 0, msg = "success", data = {}} = {}) {
        req.res = {
            httpCode, code, msg, data
        }
    }
    next()
}

export function errorHandler(error, req, res, next) {
    console.log(error)
    if (req.method === "GET") {
        console.log(`path:${req.path}, query:${JSON.stringify(req.query)}, params:${JSON.stringify(req.params)}`)
    } else {
        console.log(`path:${req.path}, body:${JSON.stringify(req.body)}`)
    }
    if (error instanceof UserError) {
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

export function handle(handlers) {
    const l = handlers.map(f => {
        return async (req, res, next) => {
            await f(req, res)
            next()
        }
    })
    return [injection, buildContext, ...l, cleanContext, errorHandler, response]
}