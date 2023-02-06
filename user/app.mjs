'use strict'

import express from "express"
import {addUser, countDevice, getUserByName, getUserByUUID} from "./logic.mjs";
import {handle} from "./middleware.mjs";

const app = express()
const port = 8080

app.use(express.json())

app.post("/v1/users/add", ...handle(async (req, res, next) => {
    res.response(
        await addUser(req.context, req.body.user, req.body.inviter)
    )
    next()
}))

app.get("/v1/users/device/:device/count", ...handle(async (req, res, next) => {
    res.response(
        await countDevice(req.context, req.params.device)
    )
    next()
}))

app.get("/v1/users/uuid/:uuid", ...handle(async (req, res, next) => {
    res.response(
        await getUserByUUID(req.context, req.params.uuid)
    )
    next()
}))

app.get("/v1/users/name/:name", ...handle(async (req, res, next) => {
    res.response(
        await getUserByName(req.context, req.params.name)
    )
    next()
}))

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});