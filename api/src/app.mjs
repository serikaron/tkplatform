'use strict'

import express from "express"
import {v1Router} from "./user.mjs";

const app = express()
const port = 8080

app.use(express.json())
app.use("/v1", v1Router)

app.listen(port, () => {
    console.log('api service started')
});