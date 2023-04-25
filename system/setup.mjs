'use strict'

import express from "express";
import {TKResponse} from "../common/TKResponse.mjs";
import {routeVersion} from "./versions.mjs";
import {routeQuestion} from "./questions.mjs";
import {routeAnnouncement} from "./announcement.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1/system", router)

    setup(router)

    router.get("/setting/:key", async (req, res, next) => {
        const dbRes = await req.context.mongo.get(req.params.key)
        res.response({
            data: dbRes === null ? {} : dbRes.value
        })
        next()
    })

    router.put("/setting", async (req, res, next) => {
        await req.context.mongo.set(req.body.key, req.body.value)
        res.tkResponse(TKResponse.Success())
        next()
    })

    router.get('/settings', async (req, res, next) => {
        const dbRes = await req.context.mongo.getAll()
        res.response({
            data: dbRes === null ? {} : dbRes
        })
        next()
    })

    routeQuestion(router)

    routeVersion(router)

    routeAnnouncement(router)

    teardown(router)
}



