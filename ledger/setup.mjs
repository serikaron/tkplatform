'use strict'

import express from "express";
import {routePostLedgerEntry} from "./handlers/postLedgerEntry.mjs";
import {routePutLedgerEntry} from "./handlers/putLedgerEntry.mjs";
import {routeGetLedgerEntries} from "./handlers/getLedgerEntries.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routePostLedgerEntry(router)
    routePutLedgerEntry(router)
    routeGetLedgerEntries(router)

    teardown(router)
}