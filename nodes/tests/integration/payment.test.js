'use restrict'

import {token} from "./token.mjs";
import {call2} from "./api.mjs";
import {getMemberItems, getWalletOverview, payMember} from "./payment.mjs";
import {getOverview} from "./user.mjs";

describe("购买会员", () => {
    const box = {}

    test("查询用户总览", async () => {
        const r = await getOverview()
        expect(r.member.expiration).toBeTruthy()
        box.userOverview = {
            expiration: r.member.expiration,
            rechargeCount: r.rechargeCount
        }
    })

    test("查询钱包总览", async () => {
        const r = await getWalletOverview()
        box.walletOverview = {
            recharge: r.recharge,
            rechargeCount: r.rechargeCount
        }
    })

    test("查询会员列表", async () => {
        const itemList = await getMemberItems()
        // simple check
        expect(itemList.length).toBeGreaterThan(0)
        box.item = itemList[Math.floor(Math.random() * itemList.length)]
    })

    test("支付", async () => {
        await payMember(box.item.id)
    })

    test("检查用户总览", async () => {
        const r = await getOverview()
        expect(r.member.expiration).toBe(box.item.days * 86400 + box.userOverview.expiration)
        expect(r.rechargeCount).toBe(box.userOverview.rechargeCount + 1)
    })

    test("检查钱包总览", async () => {
        const r = await getWalletOverview()
        expect(r.recharge).toBe(box.walletOverview.recharge + Number(box.item.price) * 100)
        expect(r.rechargeCount).toBe(box.walletOverview.rechargeCount + 1)
    })
})