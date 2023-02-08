'use strict'

import axios from 'axios'

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