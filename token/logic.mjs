'use strict'

import jwt from 'jsonwebtoken'
import {v4 as uuidv4} from 'uuid'
import {delToken, getToken, setToken} from "./redis.mjs";

const secretKey = process.env.SECRET_KEY

export async function generate(payload) {
    const accessToken = jwt.sign(payload, secretKey, {
        expiresIn: "15m",
        algorithm: "HS256"
    })
    const refreshToken = uuidv4()

    try {
        await setToken(payload.id, refreshToken)
    } catch (e) {
        console.log(e)
        return {code: -1, msg: "set token failed"}
    }

    return {
        code: 0, msg: 'success', data: {
            accessToken, refreshToken
        }
    }
}

export async function verify(accessToken) {
    try {
        const payload = jwt.verify(accessToken, secretKey, {
            algorithm: "HS256"
        })

        const serverToken = await getToken(payload.id)
        if (serverToken === "" || serverToken === null) {
            return {code: -1, msg: "refresh token not found"}
        }

        return {
            code: 0, msg: "success", data: payload
        }
    } catch (e) {
        console.log(e.name)
        return {code: -100, msg: e.toString()}
    }
}

export async function refresh(accessToken, refreshToken) {
    try {
        const payload = jwt.verify(accessToken, secretKey, {
            ignoreExpiration: true,
            algorithm: "HS256"
        })

        if (payload.exp >= Math.floor(Date.now() / 1000)) {
            console.log("not an expired token")
            return {code: -2, msg: "not an expired token"}
        }

        const serverToken = await getToken(payload.id)

        if (refreshToken !== serverToken) {
            console.log("refresh token not match")
            await delToken(payload.id)
            return {code: -3, msg: "invalid token"}
        }

        return await generate(payload.id)
    } catch (e) {
        console.log(e)
        return {code: -100, msg: e.toString()}
    }
}