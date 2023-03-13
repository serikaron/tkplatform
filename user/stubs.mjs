'use strict'

import {axiosCall} from "../common/call.mjs";

export function tokenPayload(id, phone) {
    return {
        id, phone
    }
}

export function setupStub(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    req.context.stubs = {
        token: {
            gen: async (payload) => {
                // console.log(`token.gen, payload:${JSON.stringify(payload)}`)
                return await axiosCall({
                    url: "/v1/token/generate",
                    baseURL: "http://token:8080",
                    method: 'post',
                    data: payload,
                })
            }
        },
        sms: {
            verify: async (phone, code) => {
                return await axiosCall({
                    url: `/v1/sms/verify/${phone}/${code}`,
                    baseURL: "http://sms:8080",
                    method: 'GET',
                })
            }
        },
        system: {
            settings: {
                get: async (key) => {
                    return await axiosCall({
                        url: `/v1/system/setting/${key}`,
                        baseURL: "http://system:8080",
                        method: 'GET',
                    })
                }
            }
        },
        site: {
            countUserSites: async (userId) => {
                return await axiosCall({
                    url: '/v1/user/sites/count',
                    baseURL: "http://site:8080",
                    method: "GET",
                    headers: {id: userId}
                })
            },
            getUserSites: async (userId) => {
                return await axiosCall({
                    url: '/v1/user/sites',
                    baseURL: "http://site:8080",
                    method: "GET",
                    headers: {id: userId}
                })
            }
        },
        payment: {
            countRecharge: async (userId) => {
                return await axiosCall({
                    url: "/v1/recharge/count",
                    baseURL: "http://payment:8080",
                    method: "GET",
                    headers: {id: userId}
                })
            }
        }
    }
}