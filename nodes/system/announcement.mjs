'use strict'


import {TKResponse} from "../common/TKResponse.mjs";

const getAnnouncement = (router) => {
    router.get('/announcement', async (req, res, next) => {
        const announcement = await req.context.mongo.get("announcement")
        console.log(`announcement: ${announcement}`)

        const versionLog = async () => {
            const l = await req.context.mongo.getVersions()
            if (l === null || l.length === 0) return ""
            const version = l[0]
            return version.hasOwnProperty("updateLog") ? version.updateLog : ""
        }
        const log = await versionLog()
        console.log(`log: ${log}`)

        res.tkResponse(TKResponse.Success({
            data: {
                announcement: announcement === null ? "" : announcement.value,
                updateLog: log
            }
        }))

        next()
    })
}

export const routeAnnouncement = (router) => {
    getAnnouncement(router)
}