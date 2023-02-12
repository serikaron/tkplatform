'use strict'

import express from "express"
import 'express-async-errors'

export default function createApp() {
    const app = express()
    const port = 8080

    app.use(express.json())

    return app
}

// export default app