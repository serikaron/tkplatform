'use strict'

import axios from "axios";

const inst = axios.create({
    baseURL: "http://wap.60105114.com",
    withCredentials: true,
    headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15"},
    // proxy: {host: "localhost", port: 61715}
})

const login = async () => {
    const r = await inst.post("/mobile/Login.aspx", {
        mobile: 13902822010,
        password: 123456
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    })
    console.log(r.data)
}

const index = async () => {
    const r = await inst.get("/mobile/index.aspx")
    console.log(r.data)
}

await login()
// await index()