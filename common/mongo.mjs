'use strict'
import {MongoClient} from "mongodb";

export async function connectSystem() {
    return await connect({
        user: process.env.MONGO_SYSTEM_USER,
        pass: process.env.MONGO_SYSTEM_PASS,
        host: process.env.MONGO_SYSTEM_HOST,
        name: process.env.MONGO_SYSTEM_DB
    })
}

export async function connectUser() {
    return await connect({
        user: process.env.MONGO_USER_USER,
        pass: process.env.MONGO_USER_PASS,
        host: process.env.MONGO_USER_HOST,
        name: process.env.MONGO_USER_DB
    })
}

export async function connectSite() {
    return await connect({
        user: process.env.MONGO_SITE_USER,
        pass: process.env.MONGO_SITE_PASS,
        host: process.env.MONGO_SITE_HOST,
        name: process.env.MONGO_SITE_DB
    })
}

async function connect({user, pass, host, name}) {
    // console.log(`connecting ${name}`)
    const uri = `mongodb://${user}:${pass}@${host}:27017`
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(name)
    return {client, db}
}