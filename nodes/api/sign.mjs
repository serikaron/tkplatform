'use strict'

import crypto from "crypto";


export function sign(url, body, timestamp, secretKey) {
    const hmac = crypto.createHmac('sha256', secretKey)
    const source = decodeURI(url) + serialize(body) + `${timestamp}`
    hmac.update(source)
    const signature = hmac.digest('hex');
    return {source, signature}
}

export function serialize(obj) {
    switch (typeof obj) {
        case "number":
            return obj
        case "boolean":
            return obj
        case "string":
            return obj
        case "bigint":
            return obj
        case "object":
            return _handleObject(obj)
        default:
            return ""
    }

    // object
    function _handleObject(obj) {
        let a = []
        for (let i in obj) {
            a.push([i, serialize(obj[i])])
        }
        if (Array.isArray(obj)) {
            return a.map(x => x[1]).join("")
        } else {
            return a.sort().map(x => x.join("")).join("")
        }
    }
}