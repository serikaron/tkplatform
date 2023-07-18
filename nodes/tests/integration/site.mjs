'use strict'

import {call2} from "./api.mjs";

export const addUserSite = async (siteId) => {
    return await call2({
        method: "POST",
        path: '/v1/user/site',
        body: {siteId}
    })
}

export const getUserSite = async (userSiteId) => {
    return await call2({
        method: "GET",
        path: `/v1/user/site/${userSiteId}`
    })
}

export const getUserSites = async () => {
    return await call2({
        method: "GET",
        path: "/v1/user/sites"
    })
}

export const delUserSite = async (userSiteId) => {
    return await call2({
        method: "DELETE",
        path: `/v1/user/site/${userSiteId}`
    })
}