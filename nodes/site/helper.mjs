'use strict'

import {replaceId} from "../common/utils.mjs";

export const addTypeToSite = (site) => {
    const preset = [
        {id: "6437d4c3b0d3db516ad9fd0d", name: "嗨推"},
        {id: "6437d4dab0d3db516ad9fd0e", name: "新世界"},
        {id: "643ca67884bb2a4465f4f047", name: "新日日升"},
        {id: "643ca69884bb2a4465f4f048", name: "乐多多"},
        {id: "643ca6b184bb2a4465f4f049", name: "快麦圈"},
    ]

    const l = preset.filter(x => x.name === site.name)
    if (l.length > 0) {
        site.type = l[0].id
    }
}

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
        addTypeToSite(site)
        Object.assign(userSite.site, site)
        // userSite.site = site
        console.log(`updated site: ${JSON.stringify(site)}`)
    }
}