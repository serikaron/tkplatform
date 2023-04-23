'use strict'

import axios from "axios";
import FormData from "form-data";

const userid = "8853"
const username = "13587021931"
const accounts = ["10000", "10016"]

const post = async (url, body) => {
    const formData = new FormData()
    Object.keys(body).forEach(key => {
        formData.append(key, body[key])
    })
    return await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }
    )
}
const task = async (account) => {
    for (const a of accounts) {
        const flag = a === account ? 1 : 0
        await post("http://user.xinrisheng1688.com/index.php/User/Account/postplatforminfo/", {
            userid, username, flag,
            id: a
        })
    }

    const r = await post("http://user.xinrisheng1688.com/index.php/User/Task/ordernum/", {
        userid, username
    })

    console.log(`新日日升, ${new Date().toLocaleString()}, ${account}, ${JSON.stringify(r.data)}`)
}

const withdraw = async () => {
    const r = await post("http://user.xinrisheng1688.com/index.php/User/Pay/posttx/", {
        username,
        password: "hxy197984",
        userid,
        tixian_type: 1,
        price: 10
    })
    console.log(r.da)
}

while (true) {
    for (const a of accounts) {
        await task(a)
    }
    await new Promise(resolve => setTimeout(resolve, 180 * 1000))
}

// await withdraw()