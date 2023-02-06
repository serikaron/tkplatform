'use strict'

import {pool} from "./dao.mjs";

export async function buildContext(req, res, next) {
    req.context = {
        session: await pool.getSession()
    }
    next()
}

export async function cleanContext(req, res, next) {
    await req.context.session.close()
    next()
}

export async function response(req, res, next) {
    res.status(200).send(req.res)
}

export async function injection(req, res, next) {
    res.response = function (r) {
        req.res = r
    }
    next()
}

export function handle(handler) {
    return [injection, buildContext, handler, cleanContext, response]
}