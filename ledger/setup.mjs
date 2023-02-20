'use strict'

import express from "express";
import {routePostEntry} from "./handlers/postEntry.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routePostEntry(router)

    teardown(router)
}