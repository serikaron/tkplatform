'use strict'

import express from "express"
import {v1router} from "./logic.mjs";
import 'express-async-errors'

const app = express()
const port = 8080

app.use(express.json())

app.use('/v1', v1router)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});