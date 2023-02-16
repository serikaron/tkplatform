'use strict'

import * as dotenv from 'dotenv'
import {connectSite} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";

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
        getSites: async () => {
            return await collection.sites.find().toArray()
        },
        objectId: () => {
            return new ObjectId()
        },
        addUserSite: async (userId, userSite) => {
            await collection.userSites.updateOne(
                {userId: new ObjectId(userId)},
                {$addToSet: {sites: userSite}},
                {upsert: true}
            )
        },
        getUserSites: async (userId) => {
            return await collection.userSites.find(
                {userId: new ObjectId(userId)}, {sites: 1}
            ).toArray()
        },
        addSiteAccount: async (userId, siteId, siteAccount) => {
            await collection.userSites.updateOne(
                {userId: new ObjectId(userId), "sites.id": new ObjectId(siteId)},
                {
                    $addToSet: {
                        "sites.$.accounts": siteAccount,
                    }
                }
            )
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}


export function prepareBillAccount(context, account) {
    account.id = context.mongo.objectId()
}

export function prepareSiteAccount(context, account) {
    account.id = context.mongo.objectId()
    if (account.billAccounts !== undefined) {
        account.billAccounts.forEach(ba => {
            prepareBillAccount(context, ba)
        })
    }
}

export function prepareUserSite(context, site) {
    site.id = context.mongo.objectId()
    if (site.account !== undefined) {
        prepareSiteAccount(context, site.account)
    }
}
