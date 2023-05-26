'use strict'

import {createClient} from "redis";

const client = createClient({url: 'redis://token_cache'})

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect()

export async function setToken(uuid, refreshToken) {
    await client.set(uuid, refreshToken)
}

export async function getToken(uuid) {
    return await client.get(uuid)
}

export async function delToken(uuid) {
    await client.del(uuid)
}