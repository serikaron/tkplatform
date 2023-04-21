'use strict'

import axios from "axios";

const login = async () => {
    const r = await axios.post("http://h5.xiaoyatui1688.cn/app/login", {
        "username": "13587021931",
        "password": "hxy197984",
        "userType": 4
    })

    return r.data.data.token
}

const task = async (token) => {
    const r = await axios.post("http://h5.xiaoyatui1688.cn/app/appTaskYj", {}, {
        headers: {token}
    })

    console.log(`乐多多, ${new Date().toLocaleString()}, ${JSON.stringify(r.data)}`)
}

const token = await login()
while (true) {
    await task(token)
    await new Promise(resolve => setTimeout(resolve, 180 * 1000))
}