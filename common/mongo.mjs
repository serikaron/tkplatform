'use strict'
import {MongoClient} from "mongodb";

export async function connectSystem() {
    const uri = `mongodb://${process.env.MONGO_SYSTEM_USER}:${process.env.MONGO_SYSTEM_PASS}@${process.env.MONGO_SYSTEM_HOST}:27017`
    console.log(`connecting system db`)
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(process.env.MONGO_SYSTEM_DB)
    return {client, db}
}

export async function connectUser() {
    const uri = `mongodb://${process.env.MONGO_USER_USER}:${process.env.MONGO_USER_PASS}@${process.env.MONGO_USER_HOST}:27017`
    console.log(`connecting user db`)
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(process.env.MONGO_USER_DB)
    return {client, db}
}