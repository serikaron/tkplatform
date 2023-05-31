'use strict'

import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import routeInfo from "./routeInfo.mjs";
import {dispatch} from "./dispatcher.mjs";
import {checkPrivilege, checkToken} from "./middleware.mjs";

export function setup(app, {setup, teardown}) {

    setupDoc(app)

    setup(app)

    useTokenCheck(app)
    useDispatcher(app)
    // usePrivilege(app)

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
        apis: ['./nodes/backend/doc/*.mjs']
    }

    const swaggerSpec = swaggerJsdoc(jsdocOpt)
    app.use("/backend-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

function useDispatcher(router) {
    routeInfo.forEach(info => {
        router.use((req, res, next) => {
            req.routeInfo = info
            next()
        })
        if (info.method.toUpperCase() === "POST") {
            console.log(`${info.url} POST`)
            router.post(info.url, dispatch)
        } else if (info.method.toUpperCase() === "PUT") {
            console.log(`${info.url} PUT`)
            router.put(info.url, dispatch)
        } else if (info.method.toUpperCase() === "DELETE") {
            console.log(`${info.url} DELETE`)
            router.delete(info.url, dispatch)
        } else {
            console.log(`${info.url} GET`)
            router.get(info.url, dispatch)
        }
    })
}

function useTokenCheck(router) {
    routeInfo.forEach(info => {
        if (info.needAuth) {
            console.log(`${info.url} need auth`)
            router.use(info.url, checkToken)
        }
    })
}

function usePrivilege(router) {
    routeInfo.forEach(info => {
        if (info.needAuth) {
            router.use(info.url, checkPrivilege)
        }
    })
}