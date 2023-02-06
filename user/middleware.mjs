'use strict'

import {connect as connectMongo, close as closeMongo} from "./mongo.mjs";

export async function buildContext(req, res, next) {
    const mongo = await connectMongo()
    req.context = { mongo }
    next()
}

export async function cleanContext(req, res, next) {
    await closeMongo(req.context.mongo.client)
    next()
}

export async function response(req, res) {
    res.status(200).json(req.res)
}

export async function injection(req, res, next) {
    res.onSuccess = function (r) {
        req.res = {
            code: 0,
            msg: 'success',
            data: r
        }
    }
    res.onFailed = function (code, msg) {
        req.res = {
            code, msg,
            data: {}
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
    req.res = {
        data: {},
        errCode: -1,
        errMsg: "Internal Error"
    }
    next()
}

export function handle(handler) {
    return [injection, buildContext, handler, cleanContext, errorHandler, response]
}