'use strict'

import express from "express";
import {routeGetSite} from "./handlers/getSites.mjs";
import {routePostUserSite} from "./handlers/postUserSite.mjs";
import {routeGetUserSites} from "./handlers/getUserSites.mjs";
import {routePutUserSite} from "./handlers/putUserSite.mjs";
import {routeGetUserSite} from "./handlers/getUserSite.mjs";
import {routeGetSitesBalance} from "./handlers/getUserSitesBalance.mjs";
import {routePutUserSiteBalance} from "./handlers/putUserSiteBalance.mjs";
import {routePostUserSiteJournalEntry} from "./handlers/postUserSiteJournalEntry.mjs";
import {routeGetUserSiteJournalEntries} from "./handlers/getUserSiteJournalEntries.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetSite(router)
    routePostUserSite(router)
    routeGetUserSites(router)
    routePutUserSite(router)
    routeGetUserSite(router)
    routeGetSitesBalance(router)
    routePutUserSiteBalance(router)
    routePostUserSiteJournalEntry(router)
    routeGetUserSiteJournalEntries(router)

    teardown(router)
}