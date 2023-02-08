'use strict'

import {Response} from "./response.mjs"

export async function call(f) {
    try {
        const r = await f()
        return new Response(r.status, r.data)
    } catch (e) {
        return new Response(e.response.status, {code: e.response.data.code, msg: e.response.data.msg})
    }
}