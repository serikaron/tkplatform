'use strict'

import express from "express"
import {generate, refresh, verify} from "./logic.mjs";
import dotenv from "dotenv";

dotenv.config()

const app = express()
const port = 8080

app.use(express.json())

app.post('/v1/token/generate', async (req, res) => {
    res.send(await generate(req.body))
})

app.get('/v1/token/:token/verify', async (req, res) => {
    res.send(await verify(req.params.token))
})

app.post("/v1/token/refresh", async (req, res) => {
    res.send(await refresh(req.body.accessToken, req.body.refreshToken))
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});