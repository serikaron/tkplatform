'use strict'

import FormData from "form-data";
import axios from "axios";

const post = async (url, body) => {
    const formData = new FormData()
    Object.keys(body).forEach(key => {
        formData.append(key, body[key])
    })
    return await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
            }
        }
    )
}

const login = async (user, pass) => {
    return await post("http://h5.ydc2022.com/Login/Login", {
        UserName: user,
        Password: pass,
        Captcha: "",
        Code: ""
    })
}

const rsp = await login("13587021931", "hxy197984")
console.log(rsp)
