'use strict'

import {MongoClient, MongoServerError, ObjectId} from 'mongodb'
import * as dotenv from 'dotenv'
import {UserExists} from "../common/errors/10000-user.mjs";

dotenv.config()

async function connect() {
    const uri = `mongodb://${process.env.MONGO_USER_USER}:${process.env.MONGO_USER_PASS}@${process.env.MONGO_USER_HOST}:27017`
    const client = new MongoClient(uri)
    await client.connect()
    return client
}

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const client = await connect()
    const db = client.db(process.env.MONGO_USER_DB)
    const collection = {
        users: db.collection("users")
    }
    req.context.mongo = {
        client, db, collection,
        getUserByPhone: async (find, projection) => {
            return await collection.users
                .findOne(find, projection)
        },
        getUserById: async (id) => {
            return await collection.users
                .findOne({_id: new ObjectId(id)})
        },
        insertAndUpdate: async function ({user, inviter}) {
            const handlerError = (error) => {
                if (error instanceof MongoServerError && error.code === 11000) {
                    throw new UserExists()
                } else {
                    throw error;
                }
            }

            const withoutInviter = async () => {
                try {
                    const result = await collection.users
                        .insertOne(user)
                    return result.insertedId
                } catch (error) {
                    handlerError(error)
                    return null
                }
            }

            const withInviter = async () => {
                const session = client.startSession()
                session.startTransaction()
                try {
                    const result = await collection.users
                        .insertOne(user)
                    await collection.users
                        .updateOne(inviter.filter, inviter.update)
                    await session.commitTransaction()
                    return result.insertedId
                } catch (error) {
                    await session.abortTransaction()
                    handlerError(error)
                    return null
                } finally {
                    await session.endSession()
                }
            }

            if (inviter === undefined) {
                return await withoutInviter()
            } else {
                return await withInviter()
            }
        },
        updatePassword: async (id, password) => {
            await collection.users
                .updateOne({_id: id}, {$set: {password}})
        },
        updateAccount: async (id, phone, password) => {
            await collection.users
                .updateOne({_id: id}, {$set: {phone, password}})
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}