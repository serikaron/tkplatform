'use strict'

import {axiosCall} from "../common/call.mjs";

export function setupStub(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    req.context.stubs = {
        token: {
            gen: async (payload) => {
                return await axiosCall({
                    url: "/token/generate",
                    baseURL: this.baseURL,
                    method: 'post',
                    data: payload,
                })
            }
        }
    }
}