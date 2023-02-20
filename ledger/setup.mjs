'use strict'

import express from "express";
import {routePostLedgerEntry} from "./handlers/postLedgerEntry.mjs";
import {routePutLedgerEntry} from "./handlers/putLedgerEntry.mjs";
import {routeGetEntries} from "./handlers/getEntries.mjs";
import {routePostJournalEntry} from "./handlers/postJournalEntry.mjs";
import {routePutJournalEntry} from "./handlers/putJournalEntry.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routePostLedgerEntry(router)
    routePutLedgerEntry(router)
    routeGetEntries(router)
    routePostJournalEntry(router)
    routePutJournalEntry(router)

    teardown(router)
}