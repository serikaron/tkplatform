'use strict'

import axios from "axios";

const login = async () => {
    const r = await axios.post("http://user.wawaq.cn/ksy/api/shokey/login", {
        "mobile": "13587021931",
        "password": "hxy197984"
    })
    return r.data.RESULT.userNo
}

const getAccounts = async (userId) => {
    const r = await axios.post("http://user.wawaq.cn/ksy/api/shokey/accountList", {
        "userNo": "02261931"
    })
}

const task = async () => {
    const r = await axios.post("http://user.wawaq.cn/ksy/api/shokey/task/matchOrder", {
        "token": "2d550637cb4584d2a637321b0ce30193",
        "userNo": "02261931",
        "accId": null,
        "orderType": 0,
        "key": "VJZCMyE+cgqi+jVACsLOag=="
    })
    console.log(`新世界, ${new Date().toLocaleString()}, ${JSON.stringify(r.data)}`)
}

do {
    await task()
    await new Promise(resolve => setTimeout(resolve, 180 * 1000))
} while (true)