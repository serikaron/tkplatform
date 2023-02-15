'use strict'

import {TKResponse} from "./TKResponse.mjs"
import axios from "axios";
import {InternalError, UnknownError} from "./errors/00000-basic.mjs";
import {TKError} from "./errors/error.mjs";

export async function call(f) {
    try {
        const r = await f()
        return new TKResponse(r.status, r.data)
    } catch (e) {
        if (e.response === undefined) {
            console.log(`unknown error ${e}`)
            throw new UnknownError()
        } else if (e instanceof TKError &&
            e.response.status === 500 &&
            e.response.data.code === -2) {
            throw new InternalError()
        } else {
            return new TKResponse(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
        }
    }
}

export async function axiosCall(config) {
    try {
        // config.timeout = 5000
        const r = await axios(config)
        return new TKResponse(r.status, r.data)
    } catch (e) {
        if (e.response === undefined) {
            console.log("unknown error")
            console.log(e)
            return new TKResponse(500, {code: -100, msg: "stub call failed"})
        } else {
            return new TKResponse(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
        }
    }
}