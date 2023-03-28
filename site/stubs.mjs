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
        }
    }
}