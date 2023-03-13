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
        getInviter: async (userId) => {
            return await collection.users
                .findOne({
                    _id: new ObjectId(userId)
                }, {
                    projection: {downLines: 1, member: 1}
                })
        },
        register: async (user) => {
            // console.log(`register: ${JSON.stringify(user)}`)
            const handlerError = (error) => {
                if (error instanceof MongoServerError && error.code === 11000) {
                    throw new UserExists()
                } else {
                    throw error;
                }
            }
            try {
                const result = await collection.users
                    .insertOne(user)
                return result.insertedId
            } catch (error) {
                handlerError(error)
                return null
            }
        },
        updateInviter: async (userId, update) => {
            // console.log(`updateInviter: ${userId}, ${JSON.stringify(update)}`)
            try {
                await collection.users
                    .updateOne({
                        _id: new ObjectId(userId),
                    }, {
                        $set: update
                    })
                return true
            } catch (e) {
                console.log(e)
                return false
            }
        },
        updatePassword: async (_id, password) => {
            await collection.users
                .updateOne({_id}, {$set: {password}})
        },
        updateAccount: async (_id, phone) => {
            await collection.users
                .updateOne({_id}, {$set: {phone}})
        },
        getOverview: async (userId) => {
            return await collection.users
                .findOne({
                    _id: new ObjectId(userId)
                }, {
                    projection: {
                        _id: 0, name: 1, contact: 1, member: 1, registeredAt: 1
                    }
                })
        },
        updateOverview: async (userId, update) => {
            await collection.users
                .updateOne({
                    _id: new ObjectId(userId)
                }, {
                    $set: update
                })
        },
        getDownLines: async (userId) => {
            const r = await collection.users
                .findOne({
                    _id: new ObjectId(userId)
                }, {
                    projection: {_id: 0, downLines: 1}
                })
            return r.downLines
        },
        getDownLineInfo: async (userId) => {
            return await collection.users
                .findOne({
                    _id: new ObjectId(userId)
                }, {
                    projection: {_id: 0, phone: 1, registeredAt: 1, name: 1, member: 1}
                })
        },
        updateDownLine: async (userId, downLineUserId, update) => {
            await collection.users
                .updateOne({
                    _id: new ObjectId(userId)
                }, {
                    $set: {"downLines.$[downLine].alias": update.alias}
                }, {
                    arrayFilters:[{"downLine.id": new ObjectId(downLineUserId)}]
                })
        },
        getPassword: async ({userId, phone}) => {
            const filter = {}
            if (userId !== undefined) {
                filter._id = new ObjectId(userId)
            }
            if (phone !== undefined) {
                filter.phone = phone
            }
            return await collection.users
                .findOne(filter, {
                    projection: {phone: 1, password: 1}
                })
        },
        getUserCentre: async (userId) => {
            return await collection.users
                .findOne(
                    {_id: new ObjectId(userId)},
                    {projection: {phone: 1, member: 1}}
                )
        }
    }
}

export async function cleanMongo(req) {
    await req.context.mongo.client.close()
}