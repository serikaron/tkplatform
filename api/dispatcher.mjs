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

export async function dispatch(req, res, next) {
    const axiosConfig = {
        baseURL: getBaseURL(req.url),
        method: req.method,
        url: req.url,
        // headers: req.headers
    };
    console.log(`dispatch, ${JSON.stringify(axiosConfig)}`)
    if (req.method === 'POST' || req.method === 'PUT') {
        axiosConfig.data = req.body;
    }
    const response = await axiosCall(axiosConfig)
    res.response({
        status: response.status,
        code: response.code,
        msg: response.msg,
        data: response.data
    })
    next()
}