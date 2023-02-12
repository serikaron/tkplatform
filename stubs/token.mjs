'use strict'

import {axiosCall} from "./call.mjs";

export class Token {
    get baseURL() {
        return "http://token:8080"
    }

    async generate(phone) {
        return axiosCall({
            url: "/v1/token/generate",
            baseURL: this.baseURL,
            method: 'post',
            data: {
                uuid: phone
            }
        })
    }
}