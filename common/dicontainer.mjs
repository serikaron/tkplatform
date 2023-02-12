'use strict'

import {TKError} from "../errors/error.mjs";
import {errorHandler, injection, responseHandler} from "./flow.mjs";

const diContainer = {
    setup: (middlewares) => {
        return (router) => {
            router.use(injection)
            middlewares.forEach(middleware => {
                router.use(middleware)
            })
        }
    },
    teardown: (middlewares) => {
        return (router) => {
            middlewares.forEach(middleware => {
                router.use(middleware)
            })
            router.use(errorHandler)
            router.use(responseHandler)
        }
    }
}

export default diContainer