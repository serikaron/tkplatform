'use strict'

import express from "express";
import {route as routeRequire} from "./require.mjs"
import {route as routeVerify} from "./verify.mjs"

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use('/v1/captcha', router)

    setup(router)

    routeRequire(router)
    routeVerify(router)

    teardown(router)
}