'use strict'

import express from "express";
import {route as routeRegister} from "./handlers/register.mjs";
import {route as routeLogin} from "./handlers/login.mjs"
import {route as routeResetPassword} from "./handlers/resetPassword.mjs"
import {route as routeResetAccount} from "./handlers/resetAccount.mjs"
import {routeGetUserMember} from "./handlers/getUserMember.mjs";
import {routeGetUserOverview} from "./handlers/getUserOverview.mjs";
import {routePutUserOverview} from "./handlers/putUserOverview.mjs";
import {routeGetDownLines} from "./handlers/getDownLines.mjs";
import {routePutUserDownLine} from "./handlers/putDownLine.mjs";

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
    routeGetUserMember(router)
    routeGetUserOverview(router)
    routePutUserOverview(router)
    routeGetDownLines(router)
    routePutUserDownLine(router)

    teardown(router)
}
