'use restrict'

// import client from "./client.json" assert {type: "json"}
// import {runTest} from "./api.mjs";
import {addSite, getSites, getSiteTemplates, updateSite} from "./backend.mjs";
import {addUserSite, getUserSite, getUserSites} from "./site.mjs";

// no concurrent
// test.each([
//     {name: "Get system sites", method: "GET", path: "/v1/sites"},
//     {name: "Get system sites with params", method: "GET", path: "/v1/sites?keyword=&offset=0&limit=10"},
// ])("$name ($path) should ok", async ({method, path, verify, body}) => {
//     await runTest({
//         authentication: client,
//         method,
//         path,
//         body,
//         verify,
//     })
// })

const defaultSite = {
    name: "正常站点",
    icon: "",
    status: 1,
    rates: {
        hot: 4.4,
        quality: 3.3
    },
    isFree: true,
    added: false,
    disabled: false,
    url: "www.baidu.com",
    downloadUrl: "www.baidu.com/download",
    type: "123"
}

describe("添加站点", () => {
    const test = async (inputSite, expectSite) => {
        const r = await addSite(inputSite)
        const id = r.id

        const r1 = await getSites({offset: 0, limit: 1})
        expectSite.id = id
        expect(r1.items.length).toBe(1)
        expect(r1.items[0]).toStrictEqual(expectSite)
    }
    it("正常添加", async () => {
        await test(defaultSite, {
            name: "正常站点",
            icon: "",
            status: 1,
            rates: {
                hot: 4.4,
                quality: 3.3
            },
            isFree: true,
            added: false,
            disabled: false,
            url: "www.baidu.com",
            downloadUrl: "www.baidu.com/download",
            type: "123"
        })
    })
    it("非法hot", async () => {
        const testHot = async (inputHot, expectHot) => {
            const inputSite = JSON.parse(JSON.stringify(defaultSite))
            inputSite.name = "非法hot"
            inputSite.rates.hot = inputHot
            const expectSite = JSON.parse(JSON.stringify(defaultSite))
            expectSite.name = "非法hot"
            expectSite.rates.hot = expectHot
            console.log(JSON.stringify(inputSite))
            console.log(JSON.stringify(expectSite))
            await test(inputSite, expectSite)
        }

        await testHot("invalidHot", 0)
        await testHot(-1, 0)
        await testHot(5.5, 5)
    })
})

test.each([
    {id: "6437d4c3b0d3db516ad9fd0d", name: "嗨推"},
    {id: "6437d4dab0d3db516ad9fd0e", name: "新世界"},
    {id: "643ca67884bb2a4465f4f047", name: "新日日升"},
    {id: "643ca69884bb2a4465f4f048", name: "乐多多"},
    {id: "643ca6b184bb2a4465f4f049", name: "快麦圈"},
    {id: "649cf8bf7b28731043e11ddd", name: "小吉他"},
])("($#) 固定站点id测试", async ({id, name}) => {
    const site = JSON.parse(JSON.stringify(defaultSite))
    site.name = name

    const addSiteRsp = await addSite(site)
    // expect(addSiteRsp.templateId).toBe(id)
    const siteId = addSiteRsp.id

    // const getSitesRsp = await getSites()
    // expect(getSitesRsp.items[0].templateId).toBe(id)

    const addUserSiteRsp = await addUserSite(siteId)
    expect(addUserSiteRsp.site.type).toBe(id)

    const userSiteId = addUserSiteRsp.id

    const getUserSiteRsp = await getUserSite(userSiteId)
    expect(getUserSiteRsp.site.type).toBe(id)

    const getUserSitesRsp = await getUserSites()
    const userSite = getUserSitesRsp.filter(x => {
        return x.id === userSiteId
    })[0]
    expect(userSite.site.type).toBe(id)

    // await updateSite(siteId, {disabled: true})
    // await delUserSite(userSiteId)
})

describe("站点模板", () => {
    const box = {}

    describe("arrange", () => {
        it("添加用户站点", async () => {
            const site = JSON.parse(JSON.stringify(defaultSite))
            site.name = "测试"
            const addSiteRsp = await addSite(site)
            const siteId = addSiteRsp.id
            box.siteId = siteId
            const addUserSiteRsp = await addUserSite(siteId)
            box.userSiteId = addUserSiteRsp.id
        })

        it("准备模板", async () => {
            const templates = await getSiteTemplates()
            expect(templates.items.length).toBeGreaterThan(0)
            box.siteTemplate = templates.items[0]
        })
    })

    describe("action", () => {
        it("修改模板", async () => {
            await updateSite(box.siteId, {
                template: {
                    msg: "fake site template"
                }
            })
        })
    })

    describe("assert", () => {
        it("userSite 和 site 会相应修改", async () => {
            const siteRsp = await getSites({offset: 0, limit: 1})
            expect(siteRsp.items[0].template).toStrictEqual({msg: "fake site template"})

            const userSiteRsp = await getUserSite(box.userSiteId)
            expect(userSiteRsp.site.template).toStrictEqual({msg: "fake site template"})
        })
    })
})