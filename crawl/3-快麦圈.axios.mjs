'use strict'

import axios from "axios";
import JSSoup from "jssoup"

const Soup = JSSoup.default

const inst = axios.create({
    baseURL: "http://m.kmq999.com",
    withCredentials: true,
    headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15"},
    // proxy: {host: "localhost", port: 61715}
})

let cookies = []

const setCookies = (headers) => {
    cookies = headers["set-cookie"].map(x => {
        return x.split(";")[0]
    })
}

const getLoginToken = async () => {
    const r = await inst.get('/login')
    setCookies(r.headers)
    const soup = new Soup(r.data)
    return soup.find("head")
        .findAll('meta')
        .map(x => x.attrs)
        .filter(x => x.name === "csrf-token")[0]
        .content
}

const login = async (token) => {
    const r = await inst.post("/login", {
        _token: token,
        phone: "13587021931",
        password: "hxy197984"
    }, {
        headers: {
            Cookie: cookies.join(";"),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    setCookies(r.headers)
    console.log(r.data)
    const soup = new Soup(r.data)
    return soup.find("head")
}


const loginToken = await getLoginToken()
const redirect = await login(loginToken)
console.log(redirect)