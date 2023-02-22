'use strict'

import express from "express";
import {routeGetItems} from "./handlers/getItems.mjs";
import {routeGetWallet} from "./handlers/getWallet.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetItems(router)
    routeGetWallet(router)

    teardown(router)
}