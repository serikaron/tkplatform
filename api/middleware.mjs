'use strict'

import 'dotenv/config'
import {sign} from "./sign.mjs";
import {Token} from "./stub.mjs";

function checkSign(req, res, next) {
    const s = sign(req.url, req.body, req.header("timestamp"), process.env.SECRET_KEY)
    if (s.signature !== req.header("signature")) {
        console.log(s.signature)
        console.log("invalid signature")
        res.status(400).end()
        return
    }
    next()
}

function checkTime(req, res, next) {
    const now = Math.floor(Date.now() / 1000)
    const tHeader= req.header("timestamp")
    const timestamp = parseInt(tHeader, 10)
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

export function handleWithoutAuth(handler) {
    return [checkTime, checkSign, handler]
}

export function handleWithAuth(handler) {
    return [checkTime, checkSign, checkToken, handler]
}