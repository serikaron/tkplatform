'use restrict'

import {token} from "./token.mjs";
import {call2} from "./api.mjs";
import {getMemberItems, getPaymentRecord, getWallet, getWalletOverview, payMember} from "./payment.mjs";
import {getOverview, getUserCentre} from "./user.mjs";
import {getCommissionConfig} from "./backend.mjs";
import {formatMoney, parseMoney} from "../../common/utils.mjs";

describe("购买会员", () => {
    const box = {}

    describe("before pay, store state", () => {
        test("查询用户总览", async () => {
            const r = await getOverview()
            expect(r.member.expiration).toBeTruthy()
            box.userOverview = {
                phone: r.phone,
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

        test("查询上线", async () => {
            box.cash = []
            for (const i in token.upLines) {
                const r = await getWallet(token.upLines[i])
                box.cash.push(r.hasOwnProperty("cash") ? r.cash : 0)
            }
        })

        test("查询会员列表", async () => {
            const itemList = await getMemberItems()
            // simple check
            expect(itemList.length).toBeGreaterThan(0)
            box.item = itemList[Math.floor(Math.random() * itemList.length)]
        })

        test("查询资金明细（后台）", async () => {
            const storeRecord = async (token) => {
                const u = await getUserCentre(token)
                const phone = u.phone
                const records = await getPaymentRecord({
                    phone: phone, offset: 0, limit: 1
                })
                return {phone, records: records.items}
            }

            box.paymentRecords = {}
            box.paymentRecords["pay"] = await storeRecord(token.default)
            box.paymentRecords.commissions = []
            for (const i in token.upLines) {
                const r = await storeRecord(token.upLines[i])
                box.paymentRecords.commissions.push(r)
            }
        })
        test("记录分成比例", async () => {
            const r = await getCommissionConfig()
            for (const c of r) {
                if (c.commissionType === 1) {
                    box.rateList = [c.rate1, c.rate2, c.rate3]
                    break
                }
            }
        })
    })

    test("支付", async () => {
        await payMember(box.item.id)
    })

    describe("after pay, check state", () => {
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

        const commissionOfLevel = (level) => {
            return formatMoney(Number(box.item.price) * box.rateList[level])
        }

        test("检查上线分成", async () => {
            // 只检查三级分成，按人数的加成没检查
            for (const i in token.upLines) {
                const r = await getWallet(token.upLines[i])
                expect(r.cash).toBe(box.cash[i] + parseMoney(commissionOfLevel(i)))
            }
        })

        describe("检查资金明细", () => {
            const check = async (storedState, record) => {
                const r = await getPaymentRecord({
                    phone: storedState.phone, offset: 0, limit: 2
                })
                expect(r.items.length).toBe(storedState.records.length + 1)
                if (storedState.records.length > 0) {
                    expect(storedState.records[0]).toStrictEqual(r.items[1])
                }
                const actually = r.items[0]
                // ignore these fields
                delete actually.id
                delete actually.createdAt
                expect(actually).toStrictEqual(record)
            }

            const upLineRemark = (level) => {
                switch (level) {
                    case 1:
                        return "提成一级奖励"
                    case 2:
                        return "提成二级奖励"
                    case 3:
                        return "提成三级奖励"
                    default:
                        return null
                }
            }
            test("支付明细", async () => {
                const wallet = await getWallet(token.default)
                await check(box.paymentRecords.pay, {
                    phone: box.paymentRecords.pay.phone,
                    type: 2,
                    category: "购买会员",
                    outcome: box.item.price,
                    balance: formatMoney(wallet.cash),
                    remark: `${box.userOverview.phone}购买会员`
                })
            })
            test("提成明细", async () => {
                for (const i in box.paymentRecords.commissions) {
                    const level = Number(i)
                    const wallet = await getWallet(token.upLines[level])
                    const commission = box.paymentRecords.commissions[level]
                    await check(commission, {
                        phone: commission.phone,
                        type: 1,
                        category: "下级提成奖励",
                        income: commissionOfLevel(level),
                        balance: formatMoney(wallet.cash),
                        contributor: box.userOverview.phone,
                        remark: `${box.userOverview.phone}购买会员${upLineRemark(level+1)}`
                    })
                }
            })
        })
    })
})