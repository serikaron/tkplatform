'use strict'

import express from "express";
import {routeGetSite} from "./handlers/getSites.mjs";
import {routePostUserSite} from "./handlers/postUserSite.mjs";
import {routeGetUserSites} from "./handlers/getUserSites.mjs";
import {routePostSiteAccount} from "./handlers/postSiteAccount.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetSite(router)
    routePostUserSite(router)
    routeGetUserSites(router)
    routePostSiteAccount(router)

    teardown(router)
}