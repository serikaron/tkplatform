'use strict'

import express from "express";
import {routeGetSite} from "./handlers/getSites.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetSite(router)

    teardown(router)
}