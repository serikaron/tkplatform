'use strict'

import axios from 'axios'
import {Response} from "./response.mjs"

async function call(f) {
    try {
        const r = await f()
        return new Response(r.data)
    } catch (e) {
        console.log(e)
        return new Response({code: -1, msg: "call failed"})
    }
}

export class System {
    static baseURL = "http://system:8080/v1/system"

    static async getConfig(key) {
        return call(async () => {
            return axios({
                url: `/config/${key}`,
                baseURL: this.baseURL
            });
        })
    }

    static async getNodes() {
        return call(async () => {
            return axios({
                url: `/nodes`,
                baseURL: this.baseURL
            })
        })
    }
}

export class User {
    static baseURL = "http://user:8080/v1/users"

    static async countDevice(device) {
        return call(async () => {
            return axios({
                url: `/device/${device}/count`,
                baseURL: this.baseURL
            })
        })
    }

    static async addUser(user, inviter) {
        return call(async () => {
            return axios({
                url: "/add",
                baseURL: this.baseURL,
                method: 'post',
                data: {
                    user, inviter
                }
            })
        })
    }

    static async getByName(name) {
        return call(async () => {
            return axios({
                url: `/name/${name}`,
                baseURL: this.baseURL,
                method: 'get'
            })
        })
    }

    static async getByUUID(uuid) {
        return call(async () => {
            return axios({
                url: `/uuid/${uuid}`,
                baseURL: this.baseURL,
                method: 'get'
            })
        })
    }
}

export class V2ray {
    static baseURL = "http://core_wrapper:8080/v1"

    static async add(uuid, username) {
        return call(async () => {
            return axios({
                url: "/add",
                baseURL: this.baseURL,
                method: 'post',
                data: {uuid, username}
            })
        })
    }
}

export class Token {
    static baseURL = "http://token:8080/v1"

    static async verify(token) {
        return call(async () => {
            return axios({
                url: `/token/${token}/verify`,
                baseURL: this.baseURL,
                method: 'get'
            })
        })
    }

    static async generate(payload) {
        return call(async () => {
            return axios({
                url: "/token/generate",
                baseURL: this.baseURL,
                method: 'post',
                data: payload
            })
        })
    }

    static async refresh(accessToken, refreshToken) {
        return call(async () => {
            return axios({
                url: "/token/refresh",
                baseURL: this.baseURL,
                method: 'post',
                data: [accessToken, refreshToken]
            })
        })
    }
}