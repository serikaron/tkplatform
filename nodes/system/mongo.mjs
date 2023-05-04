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
        versions: system.db.collection("versions"),
    }
    req.context.mongo = {
        client: system.client, db: system.db, collection,
        get: async (key) => {
            return await collection.settings
                .findOne({key})
        },
        set: async (key, value) => {
            return await collection.settings
                .updateOne({key}, {$set: {value}}, {upsert: true})
        },
        getAll: async () => {
            return await collection.settings
                .find()
                .toArray()
        },
        getQuestions: async (offset, limit) => {
            const r = collection.questions
                .find({}, {
                    projection: {_id: 1, question: 1, icon: 1}
                })

            if (offset !== undefined) r.skip(offset)
            if (limit !== undefined) r.limit(limit)
            return await r.toArray()
        },
        countQuestions: async () => {
            return await collection.questions
                .countDocuments()
        },
        getAnswer: async (id) => {
            return await collection.questions
                .findOne({_id: new ObjectId(id)})
        },
        addQuestion: async (q) => {
            const r = await collection.questions
                .insertOne(q)
            return r.insertedId
        },
        updateQuestion: async (id, q) => {
            await collection.questions
                .updateOne(
                    {_id: new ObjectId(id)},
                    {$set: q}
                )
        },
        deleteQuestion: async (id) => {
            await collection.questions
                .deleteOne({_id: new ObjectId(id)})
        },
        getVersions: async () => {
            return await collection.versions
                .find()
                .sort({version: -1})
                .toArray()
        },
        addVersion: async (version) => {
            await collection.versions
                .insertOne(version)
        },
        delVersion: async (id) => {
            await collection.versions
                .deleteOne({_id: new ObjectId(id)})
        },
        getAnnouncement: async () => {
            return await collection.settings
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}