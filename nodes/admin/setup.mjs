'use strict'

import express from "express";
import {routePrivileges} from "./handlers/privileges.mjs";
import {routeCheckPrivileges} from "./handlers/checkPrivilege.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routePrivileges(router)
    routeCheckPrivileges(router)

    teardown(router)
}