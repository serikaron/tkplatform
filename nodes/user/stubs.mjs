'use strict'

import {axiosCall} from "../common/call.mjs";
import axios from "axios";
import {TKResponse} from "../common/TKResponse.mjs";
import {InternalError} from "../common/errors/00000-basic.mjs";

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
            updateWallet: async (userId, update) => {
                return await axiosCall({
                    url: "/v1/wallet",
                    baseURL: "http://payment:8080",
                    method: "POST",
                    headers: {id: userId},
                    data: update
                })
            },
            getWallet: async (userId) => {
                return await axiosCall({
                    url: '/v1/wallet',
                    baseURL: "http://payment:8080",
                    method: 'GET',
                    headers: {id: userId},
                })
            },
            getWalletOverview: async (userId) => {
                return await axiosCall({
                    url: "/v1/wallet/overview",
                    baseURL: "http://payment:8080",
                    method: 'GET',
                    headers: {id: userId},
                })
            },
            addBackendRecord: async (record) => {
                return await axiosCall({
                    url: "/v2/member/record",
                    baseURL: "http://payment:8080",
                    method: 'POST',
                    data: record,
                })
            },
        }
    }

    req.context.aliyun = {
        identify: async (appCode, idNo, name) => {
            console.log(`实名认证, appCode:${appCode}, idNo:${idNo}, name:${name}`)
            const body = {
                cardNo: idNo,
                realName: name
            }
            try {
                const r = await axios.post(
                    'https://zidv2.market.alicloudapi.com/idcheck/Post',
                    body,
                    {
                        headers: {
                            Authorization: `APPCODE ${appCode}`,
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    })
                return r.data
            } catch (e) {
                console.log(`axios identify error ${e}`)
                return TKResponse.fromError(new InternalError())
            }
        },
    }
}