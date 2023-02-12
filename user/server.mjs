'use strict'

import express from "express";
import {errorHandler, injection, responseHandler} from "../common/flow.mjs";
import {route} from "./handlers/register.mjs";
// import 'express-async-errors'

export function setup(app, {setup= (router) => {}, teardown= (router) => {}} = {}) {
    const router = express.Router()
    app.use('/v1/user', router)

    setup(router)

    route(router)

    teardown(router)
}
