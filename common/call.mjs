'use strict'

import {Response} from "./response.mjs"
import axios from "axios";

export async function call(f) {
    try {
        const r = await f()
        return new Response(r.status, r.data)
    } catch (e) {
        if (e.response === undefined) {
            console.log("unknown error")
            console.log(e)
            return new Response(500, {code: -100, msg: "stub call failed"})
        } else {
            return new Response(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
        }
    }
}

export async function axiosCall(config) {
    try {
        const r = await axios(config)
        return new Response(r.status, r.data)
    } catch (e) {
        if (e.response === undefined) {
            console.log("unknown error")
            console.log(e)
            return new Response(500, {code: -100, msg: "stub call failed"})
        } else {
            return new Response(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
        }
    }
}