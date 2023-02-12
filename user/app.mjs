'use strict'

import 'express-async-errors'
import express from "express"
// import {v1router} from "./router.mjs";
// import './handlers/register.mjs'
// import './handlers/login.mjs'

const app = express()
const port = 8080

app.use(express.json())

export default app

// app.use('/v1', v1router)
//
// app.listen(port, () => {
//     console.log(`listening on port ${port}`)
// });