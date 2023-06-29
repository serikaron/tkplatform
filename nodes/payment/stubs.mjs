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
            },
            getUser: async (userId) => {
                return await axiosCall({
                    url: `/v1/user/${userId}/profile`,
                    baseURL: "http://user:8080",
                    method: 'get',
                })
            },
        },
        apid: {
            getMemberItems: async (userId) => {
                return await axiosCall({
                    url: '/v1/api/store/member/items',
                    baseURL: 'http://apid:9010',
                    method: 'GET',
                    headers: {id: userId}
                })
            },
            getRiceItems: async (userId) => {
                return await axiosCall({
                    url: '/v1/api/store/rice/items',
                    baseURL: 'http://apid:9010',
                    method: 'GET',
                    headers: {id: userId}
                })
            },
            getCommissionList: async () => {
                return await axiosCall({
                    url: '/v1/api/promotion/commission/list',
                    baseURL: 'http://apid:9010',
                    method: 'GET',
                })
            },
            recharge: async (userId, rechargeType, productId) => {
                return await axiosCall({
                    url: '/v1/api/user/wallet/recharge',
                    baseURL: 'http://apid:9010',
                    method: 'POST',
                    data: {
                        recharge_type: rechargeType,
                        product_id: productId,
                    },
                    headers: {id: userId}
                })
            }
        }
    }
}