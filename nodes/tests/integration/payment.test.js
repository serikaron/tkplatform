'use restrict'

import {token} from "./token.mjs";
import {
    getMemberItems, getMemberRecord,
    getPaymentRecord,
    getRiceItems,
    getRiceRecord,
    getWallet,
    getWalletOverview,
    payMember, payRice, withdraw
} from "./payment.mjs";
import {
    getAlipayAccount,
    getIdentification,
    getOverview,
    getUserCentre,
    setAlipayAccount,
    setIdentification
} from "./user.mjs";
import {
    addCash,
    auditWithdrawals,
    getCommissionConfig,
    getWithdrawFee,
    getWithdrawRecord
} from "./backend.mjs";
import {formatMoney, now, parseMoney} from "../../common/utils.mjs";
import jwt from "jsonwebtoken";

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

            const memberRecords = await getMemberRecord({
                phone: box.userOverview.phone, offset: 0, limit: 1
            })
            box.memberRecords = memberRecords.items
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
                        remark: `${box.userOverview.phone}购买会员${upLineRemark(level + 1)}`
                    })
                }
            })
            test("会员明细", async () => {
                const userOverview = await getOverview()
                const records = await getMemberRecord({
                    phone: box.userOverview.phone, offset: 0, limit: 2
                })
                expect(records.items.length).toBe(box.memberRecords.length + 1)
                if (box.memberRecords.length > 0) {
                    expect(box.memberRecords[0]).toStrictEqual(records.items[1])
                }
                const actually = records.items[0]
                // ignore these fields
                delete actually.id
                delete actually.createdAt
                expect(actually).toStrictEqual({
                    phone: box.userOverview.phone,
                    type: 1,
                    category: "购买会员",
                    income: box.item.days,
                    balance: userOverview.member.expiration,
                    remark: `${box.userOverview.phone}购买会员`
                })
            })
        })
    })
})

describe("购买米粒", () => {
    const box = {}

    describe("记录购买前的数据", () => {
        test("查询用户总览", async () => {
            const r = await getOverview()
            expect(r.member.expiration).toBeTruthy()
            box.userOverview = {
                phone: r.phone,
                rechargeCount: r.rechargeCount
            }
        })

        test("查询用户钱包", async () => {
            const r = await getWalletOverview()
            box.walletOverview = {
                recharge: r.recharge,
                rechargeCount: r.rechargeCount
            }
            const r1 = await getWallet()
            box.rice = r1.rice
        })

        test("查询上线", async () => {
            box.cash = []
            for (const i in token.upLines) {
                const r = await getWallet(token.upLines[i])
                box.cash.push(r.hasOwnProperty("cash") ? r.cash : 0)
            }
        })

        test("查询米粒列表", async () => {
            const itemList = await getRiceItems()
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

            const riceRecords = await getRiceRecord({
                phone: box.userOverview.phone, offset: 0, limit: 1
            })
            box.riceRecords = riceRecords.items
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
        await payRice(box.item.id)
    })

    describe("after pay, check state", () => {
        test("检查用户总览", async () => {
            const r = await getOverview()
            expect(r.rechargeCount).toBe(box.userOverview.rechargeCount + 1)
        })

        test("检查用户钱包", async () => {
            const r = await getWalletOverview()
            expect(r.recharge).toBe(box.walletOverview.recharge + Number(box.item.price) * 100)
            expect(r.rechargeCount).toBe(box.walletOverview.rechargeCount + 1)
            const r1 = await getWallet()
            expect(r1.rice).toBe(box.rice + box.item.rice)
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
                    category: "购买米粒",
                    outcome: box.item.price,
                    balance: formatMoney(wallet.cash),
                    remark: `${box.userOverview.phone}购买米粒`
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
                        remark: `${box.userOverview.phone}购买米粒${upLineRemark(level + 1)}`
                    })
                }
            })
            test("米粒明细", async () => {
                const wallet = await getWallet(token.default)
                const records = await getRiceRecord({
                    phone: box.userOverview.phone, offset: 0, limit: 2
                })
                expect(records.items.length).toBe(box.riceRecords.length + 1)
                if (box.riceRecords.length > 0) {
                    expect(box.riceRecords[0]).toStrictEqual(records.items[1])
                }
                const actually = records.items[0]
                // ignore these fields
                delete actually.id
                delete actually.createdAt
                expect(actually).toStrictEqual({
                    phone: box.userOverview.phone,
                    type: 1,
                    category: "购买米粒",
                    income: box.item.rice,
                    balance: wallet.rice,
                    remark: `${box.userOverview.phone}购买米粒`
                })
            })
        })
    })
})

describe("提现测试", () => {
    const getFee = async (amount) => {
        const feeSetting = await getWithdrawFee()
        const a = feeSetting.amount
        return Math.floor(amount / a) === (amount / a) ?
            Math.floor(amount / a) * feeSetting.fee :
            (Math.floor(amount / a) + 1) * feeSetting.fee
    }

    describe("用户提现", () => {
        const box = {}

        describe("arrange", () => {
            it("钱包准备", async () => {
                const payload = jwt.verify(token.default.accessToken, "123456", {
                    ignoreExpiration: true,
                    algorithm: "HS256"
                })
                await addCash(payload.id, 10000)
                const wallet = await getWallet()
                box.cash = wallet.cash
            })

            it("实名认证", async () => {
                const r = await getIdentification()
                if (!r.identified) {
                    await setIdentification("123456", "张三")
                }
            })

            it("支付宝帐号", async () => {
                await setAlipayAccount("fake alipay account")
            })
        })

        describe("act", () => {
            it("提现申请", async () => {
                await withdraw(5000)
            })
        })

        describe("assert", () => {
            it("检查提现列表", async () => {
                const r = await getWithdrawRecord({
                    offset: 0, limit: 1
                })
                const record = r.items[0]
                delete record.id
                delete record.createdAt
                delete record.userId

                const userOverview = await getOverview()
                const userCentre = await getUserCentre()

                expect(record).toStrictEqual({
                    phone: userOverview.phone,
                    type: "帐户余额",
                    method: "支付宝",
                    name: userCentre.identification.name,
                    alipayAccount: "fake alipay account",
                    amount: "50.00",
                    fee: formatMoney(await getFee(5000)),
                    netAmount: formatMoney(5000 - await getFee(5000)),
                    status: 0
                })
            })

            it("资金明细", async () => {
                const overview = await getOverview()
                const r = await getPaymentRecord({
                    phone: overview.phone, offset: 0, limit: 1
                })

                const record = r.items[0]
                delete record.id
                delete record.createdAt

                expect(record).toStrictEqual({
                    phone: overview.phone,
                    type: 2,
                    category: "提现冻结",
                    outcome: "50.00",
                    balance: formatMoney(box.cash - 5000),
                    remark: "申请提现，冻结金额"
                })
            })

            it("检查支付宝帐号", async () => {
                const r = await getAlipayAccount()
                expect(r.alipayAccount).toBe("fake alipay account")
            })
        })
    })

    describe("提现审核", () => {
        const prepare = async () => {
            const payload = jwt.verify(token.default.accessToken, "123456", {
                ignoreExpiration: true,
                algorithm: "HS256"
            })
            await addCash(payload.id, 10000)
            await withdraw(5000)
            const r = await getWithdrawRecord({
                phone: payload.phone, offset: 0, limit: 1
            })
            return r.items[0].id
        }

        describe("通过", () => {
            const box = {}
            it("arrange", async () => {
                box.recordId = await prepare()
                box.auditedAt = now()
                box.cash = (await getWallet()).cash
            })

            it("act", async () => {
                await auditWithdrawals([box.recordId], 1, "processing")
                await auditWithdrawals([box.recordId], 2, "同意")
            })

            describe("assert", () => {
                it("检查提现记录", async () => {
                    const r = await getWithdrawRecord({
                        orderId: box.recordId
                    })
                    const record = r.items[0]
                    expect(record.id).toBe(box.recordId)
                    delete record.id
                    expect(record.auditedAt).toBeGreaterThanOrEqual(box.auditedAt)
                    expect(record.auditedAt).toBeLessThanOrEqual(now())
                    delete record.auditedAt
                    delete record.createdAt

                    const overview = await getOverview()
                    const userCentre = await getUserCentre()

                    expect(record).toStrictEqual({
                        phone: overview.phone,
                        type: "帐户余额",
                        method: "支付宝",
                        name: userCentre.identification.name,
                        alipayAccount: "fake alipay account",
                        amount: "50.00",
                        fee: formatMoney(await getFee(5000)),
                        netAmount: formatMoney(5000 - await getFee(5000)),
                        status: 2,
                        remark: "同意"
                    })
                })

                it("检查资金明细", async () => {
                    const overview = await getOverview()
                    const r = await getPaymentRecord({
                        phone: overview.phone, offset: 0, limit: 1
                    })

                    const record = r.items[0]
                    expect(record.id).toBeTruthy()
                    delete record.id
                    expect(record.createdAt).toBeGreaterThanOrEqual(box.auditedAt)
                    expect(record.createdAt).toBeLessThanOrEqual(now())
                    delete record.createdAt

                    expect(record).toStrictEqual({
                        phone: overview.phone,
                        type: 2,
                        category: "提现成功扣除",
                        outcome: "50.00",
                        balance: formatMoney(box.cash),
                        remark: "提现成功，扣款金额"
                    })
                })
            })
        })
        describe("驳回", () => {
            const box = {}
            it("arrange", async () => {
                box.recordId = await prepare()
                box.auditedAt = now()
                box.cash = (await getWallet()).cash
            })

            it("act", async () => {
                await auditWithdrawals([box.recordId], 1)
                await auditWithdrawals([box.recordId], 3, "驳回")
            })

            describe("assert", () => {
                it("检查提现记录", async () => {
                    const r = await getWithdrawRecord({
                        orderId: box.recordId
                    })
                    const record = r.items[0]
                    expect(record.id).toBe(box.recordId)
                    delete record.id
                    expect(record.auditedAt).toBeGreaterThanOrEqual(box.auditedAt)
                    expect(record.auditedAt).toBeLessThanOrEqual(now())
                    delete record.auditedAt
                    delete record.createdAt

                    const overview = await getOverview()
                    const userCentre = await getUserCentre()

                    expect(record).toStrictEqual({
                        phone: overview.phone,
                        type: "帐户余额",
                        method: "支付宝",
                        name: userCentre.identification.name,
                        alipayAccount: "fake alipay account",
                        amount: "50.00",
                        fee: formatMoney(await getFee(5000)),
                        netAmount: formatMoney(5000 - await getFee(5000)),
                        status: 3,
                        remark: "驳回"
                    })
                })

                it("检查资金明细", async () => {
                    const overview = await getOverview()
                    const r = await getPaymentRecord({
                        phone: overview.phone, offset: 0, limit: 1
                    })

                    const record = r.items[0]
                    expect(record.id).toBeTruthy()
                    delete record.id
                    expect(record.createdAt).toBeGreaterThanOrEqual(box.auditedAt)
                    expect(record.createdAt).toBeLessThanOrEqual(now())
                    delete record.createdAt

                    expect(record).toStrictEqual({
                        phone: overview.phone,
                        type: 1,
                        category: "提现解冻",
                        income: "50.00",
                        balance: formatMoney(box.cash + 5000),
                        remark: "提现失败，解冻金额"
                    })
                })
            })
        })
    })
})
