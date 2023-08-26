'use strict'

import JSSoup from "jssoup"
import FormData from "form-data";
import chrome from 'selenium-webdriver/chrome.js'
import {Builder, By, Key, until} from 'selenium-webdriver';


const Soup = JSSoup.default

const options = new chrome.Options()
options.addArguments('--disable-infobars');
options.addArguments('--disable-extensions');
options.addArguments('--disable-popup-blocking');
options.addArguments('--disable-notifications');
options.addArguments('--start-maximized');
options.addArguments('--headless')
// options.addArguments(`--proxy-server=localhost:61715`)

const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

const getTokenForLogin = async (host) => {
    await driver.get(`${host}/login`)
    const page = await driver.getPageSource()
    const soup = new Soup(page)
    return soup.find("head")
        .findAll('meta')
        .map(x => x.attrs)
        .filter(x => x.name === "csrf-token")[0]
        .content
}

const login = async (token) => {
    // const r = await post("/login", {
    //     _token: token,
    //     phone: "13587021931",
    //     password: "hxy197984"
    // })
    //
    // console.log(r.data)
}

const hostList = [
    "http://m.dzg003.com",
    "http://m.jst001.com",
    "http://m.mdd161.com",
    "http://m.xty001.com",
    "http://m.xlw8888.com",
    "http://m2.tzg8888.com",
]

for (const host of hostList) {
    try {
        const token = await getTokenForLogin(host)
        console.log(`host: ${host}, token: ${token}`)
        // await login(await getTokenForLogin())
    } catch {
        console.log(`FAILED!!! host: ${host}`)
    }
}

await driver.quit()

const j1 = {
    "loginPageURL": "http://m.kmq999.com/login",
    "loginURL": "http://m.kmq999.com/login",
    "loginParams": [
        "_token",
        "phone",
        "password",
        "captcha"
    ],
    "getAccountPageURL": "http://m.kmq999.com/app/buyer/index",
    "getAccountURL": "http://m.kmq999.com/app/buyer/tasks/step1",
    "getTaskURL": "http://m.kmq999.com/app/buyer/tasks/has_order",
    "balanceURL": "http://m.kmq999.com/app/center/cash",
    "withdrawURL": "http://m.kmq999.com/app/center/cash",
    "withdrawParams": [
        "coin",
        "sum"
    ]
}

const j2 = {
    "loginPageURL": "http://m.xyw009.com/login",
    "loginURL": "http://m.xyw009.com/login",
    "loginParams": [
        "_token",
        "phone",
        "password",
        "captcha"
    ],
    "getAccountPageURL": "http://m.xyw009.com/app/buyer/index",
    "getAccountURL": "http://m.xyw009.com/app/buyer/tasks/step1",
    "getTaskURL": "http://m.xyw009.com/app/buyer/tasks/has_order",
    "balanceURL": "http://m.xyw009.com/app/center/cash",
    "withdrawURL": "http://m.xyw009.com/app/center/cash",
    "withdrawParams": [
        "coin",
        "sum"
    ]
}