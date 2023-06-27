'use strict'

import {axiosCall} from "../common/call.mjs";

export async function setupStubs(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    req.context.stubs = {
        ledger: {
            countSitesRecords: async (userId) => {
                return await axiosCall({
                    url: "/v1/sites/records/count",
                    baseURL: "http://ledger:8080",
                    method: 'get',
                    headers: {id: userId}
                })
            }
        },
        user: {
            getUser: async (userId) => {
                return await axiosCall({
                    url: `/v1/backend/user/${userId}`,
                    baseURL: "http://user:8080",
                    method: 'get',
                    headers: {id: userId}
                })
            }
        },
        payment: {
            checkPayed: async (logId) => {
                return await axiosCall({
                    url: `/v2/log/${logId}/payed`,
                    baseURL: "http://payment:8080",
                    method: 'get',
                })
            }
        },
        apid: {
            search: async (body) => {
                return await axiosCall({
                    url: '/v1/api/check',
                    baseURL: "http://apid:9010",
                    method: 'post',
                    data: body
                })
            }
        }
    }
}