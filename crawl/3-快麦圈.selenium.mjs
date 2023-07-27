'use strict'

import JSSoup from "jssoup"
import FormData from "form-data";
import chrome from 'selenium-webdriver/chrome.js'
import { Builder, By, Key, until } from 'selenium-webdriver';


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

const getTokenForLogin = async () => {
    await driver.get("http://m.kmq999.com/login")
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

const token = await getTokenForLogin()
console.log(`token: ${token}`)
// await login(await getTokenForLogin())

await driver.quit()
