'use strict'

import {TKResponse} from "../common/TKResponse.mjs";
import {replaceId} from "../common/utils.mjs";
import {NotFound} from "../common/errors/00000-basic.mjs";

const getVersionsAll = (router) => {
    router.get('/versions/all', async (req, res, next) => {
        const l = await req.context.mongo.getVersions()
        res.tkResponse(TKResponse.Success({
            data: l === null ? [] : l.map(replaceId)
        }))
        next()
    })
}

const getVersionsHistory = (router) => {
    router.get('/versions/history', async (req, res, next) => {
        const l = await req.context.mongo.getVersions()
        res.tkResponse(TKResponse.Success({
            data: l === null ? [] : l.map(replaceId).slice(1)
        }))
        next()
    })
}

const getLatestVersion = (router) => {
    router.get('/version/latest', async (req, res, next) => {
        const l = await req.context.mongo.getVersions()
        if (l === null || l.length === 0) {
            throw new NotFound()
        }

        const v = l[0]
        res.tkResponse(TKResponse.Success({
            data: v
        }))
        next()
    })
}

const addVersion = (router) => {
    router.post('/version', async (req, res, next) => {
        await req.context.mongo.addVersion(req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })
}

const delVersion = (router) => {
    router.delete('/version/:versionId', async (req, res, next) => {
        await req.context.mongo.delVersion(req.params.versionId)
        res.tkResponse(TKResponse.Success())
        next()
    })
}

export const routeVersion = (router) => {
    getVersionsHistory(router)
    getVersionsAll(router)
    getLatestVersion(router)
    addVersion(router)
    delVersion(router)
}