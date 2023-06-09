'use strict'

import {replaceId} from "../common/utils.mjs";

export const makeUserSite = async (req, userSite) => {
    replaceId(userSite)
    delete userSite.userId
    userSite.setting.schedule.forEach(s => {
        if (s.activated === undefined) {
            s.activated = false
        }
    })
    const site = await req.context.mongo.getSite(userSite.site.id)
    console.log(`site: ${JSON.stringify(site)}`)
    if (site !== null && site !== undefined) {
        site.id = site._id
        delete site._id
        Object.assign(userSite.site, site)
        // userSite.site = site
        console.log(`updated site: ${JSON.stringify(site)}`)
    }
}