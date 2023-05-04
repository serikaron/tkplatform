'use strict'

import {axiosCall} from "../common/call.mjs";

export async function setupStubs(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    req.context.stubs = {
        site: {
            getUserSite: async (userId, userSiteId) => {
                return await axiosCall({
                    url: `/v1/user/site/${userSiteId}`,
                    baseURL: "http://site:8080",
                    method: 'get',
                    headers: {id: userId}
                })
            }
        }
    }
}