'use strict'

import * as dotenv from 'dotenv'
import {connectAdmin} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";
import {dateToTimestamp} from "../common/utils.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const admin = await connectAdmin()
    const collection = {
        privileges: admin.db.collection("privileges"),
    }
    req.context.mongo = {
        client: admin.client, db: admin.db, collection,

        setPrivileges: async (adminId, privileges) => {
            await collection.privileges.updateOne(
                {adminId: new ObjectId(adminId)},
                {$set: {privileges}},
                {upsert: true}
            )
        },

        getPrivileges: async (adminId) => {
            return collection.privileges.findOne(
                {adminId: new ObjectId(adminId)}
            )
        },

        getAllPrivileges: async () => {
            return await collection.privileges.find().toArray()
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}
