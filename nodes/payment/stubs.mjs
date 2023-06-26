'use strict'

import {axiosCall} from "../common/call.mjs";
import axios from "axios";
import {TKResponse} from "../common/TKResponse.mjs";
import {InternalError} from "../common/errors/00000-basic.mjs";

export function setupStub(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    req.context.stubs = {
        user: {
            addMember: async (userId, days) => {
                // console.log(`token.gen, payload:${JSON.stringify(payload)}`)
                return await axiosCall({
                    url: "/v1/user/member",
                    baseURL: "http://user:8080",
                    method: 'post',
                    data: {days},
                    headers: {id: userId},
                })
            }
        },
    }
}