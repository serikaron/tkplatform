'use strict'

import 'dotenv/config'
import {sign} from "./sign.mjs";
import {Token} from "./stub.mjs";

function checkSign(req, res, next) {
    const s = sign(req.originalUrl, req.body, req.header("timestamp"), process.env.SECRET_KEY)
    if (s.signature !== req.header("signature")) {
        console.log(s.source)
        console.log(s.signature)
        console.log("invalid signature")
        res.status(400).end()
        return
    }
    next()
}

function checkTime(req, res, next) {
    const now = Math.floor(Date.now() / 1000)
    const tHeader = req.header("timestamp")
    const timestamp = Number(tHeader)
    if (isNaN(timestamp)) {
        console.log("invalid timestamp header")
        res.status(400).end()
        return
    }
    const interval = now - timestamp
    if (interval >= 60 || interval <= -60) {
        console.log(`invalid timestamp ${timestamp}, server time ${now}`)
        res.status(400).end()
        return
    }
    next()
}

async function checkToken(req, res, next) {
    const token = req.header("authentication")
    if (token === "") {
        console.log("empty token")
        res.status(401).end()
        return
    }
    const verifyResult = await Token.verify(token)
    if (verifyResult.isError()) {
        console.log("invalid token")
        res.status(401).end()
        return
    }
    next()
}

async function response(req, res) {
    res.status(200).json(req.res)
}

async function injection(req, res, next) {
    res.onSuccess = function (data, code, msg) {
        req.res = {
            code: code === undefined ? 0 : code,
            msg: msg === undefined ? 'success' : msg,
            data: data
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

function errorHandler(error, req, res, next) {
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

export function handleWithoutAuth(handler) {
    return [checkTime, checkSign, handler]
}

export function handleWithAuth(handler) {
    return [checkTime, checkSign, checkToken, handler]
}

export function handleWithoutAuth1(handler) {
    const h = async (req, res, next) => {
        await handler(req, res)
        next()
    }
    return [checkTime, checkSign, injection, h, errorHandler, response]
}