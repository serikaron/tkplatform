'use strict'

import {errorHandler, injection, responseHandler} from "../../common/flow.mjs";
import {TKError} from "../../common/errors/error.mjs";

function mockErrorHandler(err, req, res, next) {
    if (err instanceof TKError) {
        errorHandler(err, req, res, next)
    } else {
        // console.log("mockErrorHandler")
        // console.log(err)
        // throw err
        // next(err)
        res.response({
            status: 500,
            code: 1,
            msg: `${err}`
        })
        next()
    }
}

const testDIContainer = {
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
            router.use(mockErrorHandler)
            router.use(responseHandler)
        }
    }
}

export default testDIContainer