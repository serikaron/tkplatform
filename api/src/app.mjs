'use strict'

import express from "express"
import {v1Router} from "./router.mjs";
import './stubs/user.mjs'
import './stubs/captcha.mjs'
import './stubs/sms.mjs'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const app = express()
const port = 8080

app.use(express.json())
app.use("/v1", v1Router)

const jsdocOpt = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'tkplatform',
            version: '1.0.0',
        },
    },
    tags: [
        {name: "user(用户相关)"},
        {name: "captcha(图形码)"},
    ],
    apis: ['./api/src/stubs/*.mjs']
}

const swaggerSpec = swaggerJsdoc(jsdocOpt)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
    console.log('api service started')
});