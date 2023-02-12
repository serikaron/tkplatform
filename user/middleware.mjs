'use strict'

import {connect as connectMongo, close as closeMongo} from "./mongo.mjs";
import {errorHandler} from "../common/flow.mjs";

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

export function handle(handlers) {
    const l = handlers.map(f => {
        return async (req, res, next) => {
            await f(req, res)
            next()
        }
    })
    return [injection, buildContext, ...l, cleanContext, errorHandler, response]
}