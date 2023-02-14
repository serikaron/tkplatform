'use strict'

import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import './doc/user.mjs'
import './doc/captcha.mjs'
import './doc/sms.mjs'
import routeInfo from "./routeInfo.mjs";
import {dispatch} from "./dispatcher.mjs";
import {checkToken} from "./middleware.mjs";

export function setup(app, {setup, teardown}) {
    setupDoc(app)

    setup(app)

    useTokenCheck(app)
    useDispatcher(app)

    teardown(app)
}

function setupDoc(app) {
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
        apis: ['./api/doc/*.mjs']
    }

    const swaggerSpec = swaggerJsdoc(jsdocOpt)
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
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
