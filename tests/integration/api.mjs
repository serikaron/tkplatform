'use strict'

import axios from "axios";
import {TKResponse} from "../../common/TKResponse.mjs";
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

function headers({url, body, authentication}) {
    const timestamp = Math.floor(Date.now() / 1000)
    const s = sign(url, body, timestamp, process.env.SECRET_KEY)
    return {
        timestamp,
        signature: s.signature,
        authentication: authentication === undefined ? undefined : authentication.accessToken
    }
}

function axiosConfig({path, query, body, authentication}) {
    return {
        baseURL,
        url: url(path, query),
        data: body,
        method: body === undefined ? "GET" : "POST",
        headers: headers({
            url: url(path, query),
            body,
            authentication
        })
    }
}

async function call({path, query, body, authentication}) {
    try {
        const config = axiosConfig({path, query, body, authentication})
        // console.log(`axiosConfig: ${JSON.stringify(config)}`)
        const r = await axios(config)
        return new TKResponse(r.status, r.data)
    } catch (e) {
        // console.log(e)
        return new TKResponse(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
    }
}

export function simpleVerification(response) {
    expect(response.status).toBe(200)
    expect(response.code).toBe(0)
    expect(JSON.stringify(response.data) !== "{}").toBe(true)
}

export async function runTest({path, query, body, verify = simpleVerification, authentication = {}}) {
    const response = await call({path, query, body, authentication})
    verify(response)
}

export async function requireAuthenticatedClient(phone) {
    const authenticatedClient = {
        phone,
        password: "123456",
        smsCode: "2065",
        captcha: "v53J",
        accessToken: undefined
    }
    const registerResponse = await call({
        path: "/v1/user/register",
        body: {
            phone, password: authenticatedClient.password,
            smsCode: authenticatedClient.smsCode
        }
    })
    expect(registerResponse.isSuccess()).toBe(true)
    authenticatedClient.accessToken = registerResponse.data.accessToken
    authenticatedClient.refreshToken = registerResponse.data.refreshToken
    return authenticatedClient
}