'use strict'

import {MongoServerError, ObjectId} from 'mongodb'
import * as dotenv from 'dotenv'
import {UserExists} from "../common/errors/10000-user.mjs";
import {connectUser} from "../common/mongo.mjs";

dotenv.config()

export async function setupMongo(req) {
    if (req.context === undefined) {
        req.context = {}
    }

    const user = await connectUser()
    const collection = {
        users: user.db.collection("users")
    }
    req.context.mongo = {
        client: user.client, db: user.db, collection,
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
                const session = user.client.startSession()
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