'use strict'

import axios from "axios";
import {TKResponse} from "../../common/TKResponse.mjs";
import * as dotenv from 'dotenv'
import {simpleVerification} from "./verification.mjs";

dotenv.config()

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

function headers(userId) {
    return {
        id: userId
    }
}

function axiosConfig({path, query, body, method, baseURL, userId}) {
    const getMethod = () => {
        if (method !== undefined) {
            return method
        }
        return body === undefined ? "GET" : "POST"
    }
    return {
        baseURL,
        url: url(path, query),
        data: body,
        method: getMethod(),
        headers: headers(userId)
    }
}

async function call({path, query, body, method, baseURL, userId}) {
    try {
        const config = axiosConfig({path, query, body, method, baseURL, userId})
        // console.log(`axiosConfig: ${JSON.stringify(config)}`)
        const r = await axios(config)
        return new TKResponse(r.status, r.data)
    } catch (e) {
        // console.log(e)
        return new TKResponse(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
    }
}

export async function runTest({method, path, query, body, baseURL, userId, verify = simpleVerification}) {
    const response = await call({path, query, body, method, baseURL, userId})
    verify(response)
    return response
}
