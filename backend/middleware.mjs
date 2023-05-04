'use strict'

import 'dotenv/config'
import {sign} from "./sign.mjs";
import {axiosCall} from "../common/call.mjs";
import {TKResponse} from "../common/TKResponse.mjs";
import {NeedAuth} from "../common/errors/00000-basic.mjs";
import axios from "axios";

export function checkSign(req, res, next) {
    // console.log(`checkSign, url:${req.originalUrl}`)
    // console.log(`query: ${JSON.stringify(req.query)}`)
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

export function checkTime(req, res, next) {
    // console.log("checkTime")
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

export async function tokenContext(req, res, next) {
    if (req.context === undefined) {
        req.context = {
            stubs: {}
        }
    }
    req.context.stubs.token = {
        verify: async (token) => {
            // console.log("checkToken")
            if (token === "") {
                console.log("empty token")
                return TKResponse.fromError(new NeedAuth())
            } else {
                return await axiosCall({
                    url: `/v1/token/${token}/verify`,
                    baseURL: "http://token:8080",
                    method: 'get'
                })
            }
        }
    }
    next()
}

export async function checkToken(req, res, next) {
    const verifyResult = await req.context.stubs.token.verify(req.header("authentication"))
    // console.log(verifyResult.toString())
    if (verifyResult.isError()) {
        console.log("invalid token")
        res.status(401).end()
        return
    }

    req.extractedToken = verifyResult.data
    next()
}

export async function checkPrivilege(req, res, next) {
    const checkResult = await axiosCall({
        url: `/v1/admin/privilege/${req.method}/${atob(req.url)}`,
        baseURL: "http://admin:8080",
        method: 'get',
        headers: req.headers
    })

    if (checkResult.isError()) {
        console.log(`FORBIDDEN, admin:${req.headers.id}, method:${req.method}, path:${req.url}`)
        res.status(403).end()
        return
    }

    next()
}