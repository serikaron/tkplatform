'use strict'

import {getMemberRecord, getPaymentRecord, getRiceRecord, getWallet} from "./payment.mjs";
import {addCash, addMember, addRice} from "./backend.mjs";
import jwt from "jsonwebtoken";
import {token} from "./token.mjs";
import {formatMoney, now} from "../../common/utils.mjs";
import {getOverview} from "./user.mjs";

describe.each([
    {name: "添加余额", cash: 3000, record: {type: 1, category: "管理员手动增加", income: formatMoney(3000)}},
    {name: "减少余额", cash: -3000, record: {type: 2, category: "管理员手动减少", outcome: formatMoney(3000)}},
])("余额操作-$name", ({cash, record}) => {
    const box = {}

    it("arrange", async () => {
        const wallet = await getWallet()
        box.cash = wallet.cash

        const payload = jwt.verify(token.default.accessToken, "123456", {
            ignoreExpiration: true,
            algorithm: "HS256"
        })
        box.userId = payload.id
        box.phone = payload.phone

        box.time = now()
    })

    it("act", async () => {
        await addCash(box.userId, cash)
    })

    it("assert", async () => {
        const wallet = await getWallet()
        expect(wallet.cash).toBe(box.cash + cash)

        const r = await getPaymentRecord({
            phone: box.phone, offset: 0, limit: 1
        })
        const receivedRecord = r.items[0]
        expect(receivedRecord.id).toBeTruthy()
        delete receivedRecord.id
        expect(receivedRecord.createdAt).toBeGreaterThanOrEqual(box.time)
        expect(receivedRecord.createdAt).toBeLessThanOrEqual(now())
        delete receivedRecord.createdAt
        const expectRecord = Object.assign({
            phone: box.phone,
            balance: formatMoney(wallet.cash),
            remark: "管理员手动操作资金"
        }, record)
        expect(receivedRecord).toStrictEqual(expectRecord)
    })
})

describe.each([
    {name: "添加米粒", rice: 3000, record: {type: 1, category: "管理员手动增加", income: 3000}},
    {name: "减少米粒", rice: -3000, record: {type: 2, category: "管理员手动减少", outcome: 3000}},
])("米粒操作-$name", ({rice, record}) => {
    const box = {}

    it("arrange", async () => {
        const wallet = await getWallet()
        box.rice = wallet.rice

        const payload = jwt.verify(token.default.accessToken, "123456", {
            ignoreExpiration: true,
            algorithm: "HS256"
        })
        box.userId = payload.id
        box.phone = payload.phone

        box.time = now()
    })

    it("act", async () => {
        await addRice(box.userId, rice)
    })

    it("assert", async () => {
        const wallet = await getWallet()
        expect(wallet.rice).toBe(box.rice + rice)

        const r = await getRiceRecord({
            phone: box.phone, offset: 0, limit: 1
        })
        const receivedRecord = r.items[0]
        expect(receivedRecord.id).toBeTruthy()
        delete receivedRecord.id
        expect(receivedRecord.createdAt).toBeGreaterThanOrEqual(box.time)
        expect(receivedRecord.createdAt).toBeLessThanOrEqual(now())
        delete receivedRecord.createdAt
        const expectRecord = Object.assign({
            phone: box.phone,
            balance: wallet.rice,
            remark: "管理员手动操作"
        }, record)
        expect(receivedRecord).toStrictEqual(expectRecord)
    })
})

describe.each([
    {name: "添加会员", days: 10, record: {type: 1, category: "管理员手动增加", income: 10}},
    {name: "减少会员", days: -10, record: {type: 2, category: "管理员手动减少", outcome: 10}},
])("会员操作-$name", ({days, record}) => {
    const box = {}

    it("arrange", async () => {
        const overview = await getOverview()
        box.expiration = overview.member.expiration

        const payload = jwt.verify(token.default.accessToken, "123456", {
            ignoreExpiration: true,
            algorithm: "HS256"
        })
        box.userId = payload.id
        box.phone = payload.phone

        box.time = now()
    })

    it("act", async () => {
        await addMember(box.userId, days)
    })

    it("assert", async () => {
        const overview = await getOverview()

        expect(overview.member.expiration).toBe(box.expiration + days * 86400)

        const r = await getMemberRecord({
            phone: overview.phone, offset: 0, limit: 1
        })
        const receivedRecord = r.items[0]
        expect(receivedRecord.id).toBeTruthy()
        delete receivedRecord.id
        expect(receivedRecord.createdAt).toBeGreaterThanOrEqual(box.time)
        expect(receivedRecord.createdAt).toBeLessThanOrEqual(now())
        delete receivedRecord.createdAt
        const expectRecord = Object.assign({
            phone: box.phone,
            balance: overview.member.expiration,
            remark: "管理员手动操作"
        }, record)
        expect(receivedRecord).toStrictEqual(expectRecord)
    })
})