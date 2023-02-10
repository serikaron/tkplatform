'use strict'

import axios from "axios";
import {call} from "../../common/call.mjs";

export class Token {
    static baseURL = "http://token:8080/v1"

    static async generate({phone}) {
        return call(async () => {
            return axios({
                url: "/token/generate",
                baseURL: this.baseURL,
                method: 'post',
                data: {
                    uuid: phone
                }
            })
        })
    }
}