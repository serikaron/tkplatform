'use strict'

import express from "express";
import {routeGetItems} from "./handlers/getItems.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetItems(router)

    teardown(router)
}