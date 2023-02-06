'use strict'

import express from "express"
import {getDeadline, listNode, login, refreshToken, register} from "./logic.mjs";
import {handleWithAuth, handleWithoutAuth} from "./middleware.mjs";

const app = express()
const port = 8080

app.use(express.json())

app.post("/v1/users/register", ...handleWithoutAuth(async (req, res, _) => {
    res.send(await register(req.body))
}))

app.post("/v1/users/login", ...handleWithoutAuth( async (req, res, _) => {
    res.send(await login(req.body))
}))

app.post("/v1/token/refresh", ...handleWithoutAuth(async (req, res, _) => {
    res.send(await refreshToken(req.header("authentication"), req.body.refreshToken))
}))

app.get("/v1/user/:uuid/deadline", ...handleWithAuth(async (req, res, _) => {
    res.send(await getDeadline(req.params.uuid))
}))

app.get("/v1/user/:uuid/nodes", ...handleWithAuth(async (req, res, _) => {
    res.send(await listNode(req.params.uuid))
}))

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});