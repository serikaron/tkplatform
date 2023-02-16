'use strict'

import express from "express";
import {routeGetSite} from "./handlers/getSites.mjs";
import {routeAddUserSite} from "./handlers/addUserSite.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetSite(router)
    routeAddUserSite(router)

    teardown(router)
}