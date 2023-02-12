'use strict'

import {axiosCall} from "../common/call.mjs";

export function setupStub(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    req.context.stubs = {
        token: {
            gen: async (payload) => {
                console.log(`token.gen, payload:${JSON.stringify(payload)}`)
                return await axiosCall({
                    url: "/v1/token/generate",
                    baseURL: "http://token:8080",
                    method: 'post',
                    data: payload,
                })
            }
        }
    }
}