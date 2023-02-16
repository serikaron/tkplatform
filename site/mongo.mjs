'use strict'

import * as dotenv from 'dotenv'
import {connectSite} from "../common/mongo.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const site = await connectSite()
    const collection = {
        sites: site.db.collection("sites"),
        userSites: site.db.collection("userSites")
    }
    req.context.mongo = {
        client: site.client, db: site.db, collection,
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}