'use strict'

import * as dotenv from 'dotenv'
import {connectSystem} from "../common/mongo.mjs";
import {ObjectId} from "mongodb";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const system = await connectSystem()
    const collection = {
        settings: system.db.collection("settings"),
        questions: system.db.collection("questions"),
    }
    req.context.mongo = {
        client: system.client, db: system.db, collection,
        get: async (key) => {
            return await collection.settings
                .findOne({key})
        },
        set: async (key, value) => {
            return await collection.settings
                .updateOne({key}, {$set: {value}})
        },
        getAll: async () => {
            return await collection.settings
                .find()
                .toArray()
        },
        getQuestions: async () => {
            return await collection.questions
                .find({}, {
                    projection: {_id: 1, question: 1, icon: 1}
                })
                .toArray()
        },
        getAnswer: async (id) => {
            return await collection.questions
                .findOne({_id: new ObjectId(id)})
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}