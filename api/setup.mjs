'use strict'

import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import './stubs/user.mjs'
import './stubs/captcha.mjs'
import './stubs/sms.mjs'
import routeInfo from "./routeInfo.mjs";
import {dispatch} from "./dispatcher.mjs";
import {checkToken} from "./middleware.mjs";

export function setup(app, {setup, teardown}) {
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

    setup(app)

    useTokenCheck(app)
    useDispatcher(app)

    teardown(app)
}

function useDispatcher(router) {
    routeInfo.forEach(info => {
        if (info.method.toUpperCase() === "POST") {
            router.post(info.url, dispatch)
        } else {
            router.get(info.url, dispatch)
        }
    })
}

function useTokenCheck(router) {
    routeInfo.forEach(info => {
        if (info.needAuth) {
            router.use(info.url, checkToken)
        }
    })
}
