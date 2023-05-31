'use strict'
import {axiosCall} from "../common/call.mjs";

function parse(url) {
    const s = url.split("/")
    return {
        version: s[1],
        service: s[2],
        url
    }
}

function getBaseURL(url) {
    const service = parse(url).service
    return `http://${service}:8080`
}

export function dispatchContext(req, res, next) {
    if (req.context === undefined) {
        req.context = {
            stubs: {}
        }
    }
    req.context.stubs.service = {
        call: async (axiosConfig) => {
            return await axiosCall(axiosConfig)
        }
    }
    next()
}

export async function dispatch(req, res, next) {
    console.log(`dispatch req: ${req.url}, extractedToken::${JSON.stringify(req.extractedToken)}`)
    function getUrl() {
        if (req.routeInfo.hasOwnProperty("service")
            && req.routeInfo.service.hasOwnProperty("url")
        ) {
            if (typeof req.routeInfo.service.url === "function") {
                console.log(`getUrl, is function`)
                return req.routeInfo.service.url(req)
            }
            if (req.query !== null
                && req.query !== undefined
                && Object.keys(req.query).length > 0) {
                const out = `${req.routeInfo.service.url}?${new URLSearchParams(req.query)}`
                console.log(`getUrl, with query, ${out}`)
                return out
            } else {
                const out = req.routeInfo.service.url
                console.log(`getUrl, without query, ${out}`)
                return out
            }
        }

        console.log(`getUrl, origin, ${req.url}`)
        return req.url
    }

    const axiosConfig = {
        baseURL: req.routeInfo.service === undefined || req.routeInfo.service.baseURL === undefined ? getBaseURL(req.url) : req.routeInfo.service.baseURL,
        method: req.method,
        url: getUrl(),
        headers: req.extractedToken !== undefined ? req.extractedToken : {}
    };
    console.log(`dispatch, ${JSON.stringify(axiosConfig)}`)
    if (req.method === 'POST' || req.method === 'PUT') {
        axiosConfig.data = req.body;
    }
    const response = await req.context.stubs.service.call(axiosConfig)
    res.response({
        status: response.status,
        code: response.code,
        msg: response.msg,
        data: response.data
    })
    next()
}