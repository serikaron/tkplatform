'use strict'

import express from "express";
import {route as routeRegister} from "./handlers/register.mjs";
import {route as routeLogin} from "./handlers/login.mjs"
import {route as routeResetPassword} from "./handlers/resetPassword.mjs"
import {route as routeResetAccount} from "./handlers/resetAccount.mjs"

export function setup(app, {
    setup, teardown
} = {}) {
    const router = express.Router()
    app.use('/v1/user', router)

    setup(router)

    routeRegister(router)
    routeLogin(router)
    routeResetPassword(router)
    routeResetAccount(router)

    teardown(router)
}
