'use strict'

import express from "express";
import {routeGetSite} from "./handlers/getSites.mjs";
import {routePostUserSite} from "./handlers/postUserSite.mjs";
import {routeGetUserSites} from "./handlers/getUserSites.mjs";
import {routePutUserSite} from "./handlers/putUserSite.mjs";
import {routePutUserSites} from "./handlers/putUserSites.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetSite(router)
    routePostUserSite(router)
    routeGetUserSites(router)
    routePutUserSite(router)
    routePutUserSites(router)

    teardown(router)
}