'use strict'

import axios from "axios";
import {TKResponse} from "../../../common/TKResponse.mjs";
import {sign} from "./sign.mjs";
import * as dotenv from 'dotenv'

dotenv.config()

const baseURL = "http://localhost:9000/"

function url(path, query) {
    if (query === undefined) {
        return path
    }
    const queryString =
        Object.keys(query)
            .map(key => {
                return [key, query[key]].join("=")
            })
            .join("&")
    return encodeURI(`${path}?${queryString}`)
}

function headers({url, body}) {
    const timestamp = Math.floor(Date.now() / 1000)
    const s = sign(url, body, timestamp, process.env.SECRET_KEY)
    return {
        timestamp,
        signature: s.signature
    }
}

function makeCall({path, query, body}) {
    return axios({
        baseURL,
        url: url(path, query),
        data: body,
        method: body === undefined ? "GET" : "POST",
        headers: headers({
            url: url(path, query),
            body
        })
    });
}

async function call({path, query, body}) {
    try {
        const r = await makeCall({path, query, body})
        return new TKResponse(r.status, r.data)
    } catch (e) {
        // console.log(e)
        return new TKResponse(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
    }
}

function simpleVerification(response) {
    expect(response.status).toBe(200)
    expect(response.code).toBe(0)
    expect(JSON.stringify(response.data) !== "{}").toBe(true)
}

export async function test({path, query, body, verify = simpleVerification}) {
    const response = await call({path, query, body})
    verify(response)
}

