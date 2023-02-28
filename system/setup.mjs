'use strict'

import express from "express";

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
        res.response()
        next()
    })

    teardown(router)
}



