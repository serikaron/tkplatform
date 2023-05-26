'use strict'

import {enteringLog, errorHandler, injection, responseHandler} from "./flow.mjs";

const diContainer = {
    setup: (middlewares) => {
        return (router) => {
            router.use(enteringLog)
            router.use(injection)
            middlewares.forEach(middleware => {
                router.use(middleware)
            })
        }
    },
    teardown: (middlewares) => {
        return (router) => {
            router.use(errorHandler)
            middlewares.forEach(middleware => {
                router.use(middleware)
            })
            router.use(responseHandler)
        }
    }
}

export default diContainer