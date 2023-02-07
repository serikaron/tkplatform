'use strict'

import {Response} from "./response.mjs"

export async function call(f) {
    try {
        const r = await f()
        return new Response(r.data)
    } catch (e) {
        console.log(e)
        return new Response({code: -1, msg: "call failed"})
    }
}