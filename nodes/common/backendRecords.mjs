'use strict'
export const recordType = {income: 1, outcome: 2}
export const recordCategory = {
    member: {category: 0, desc: "购买会员"},
    commission: {category: 1, desc: "下级提成奖励"},
    rice: {category: 2, desc: "购买米粒"},
    withdrawFreeze: {category: 3, desc: "提现冻结"},
    withdrawUnfreeze: {category: 4, desc: "提现解冻"},
    withdrawDone: {category: 5, desc: "提现成功扣除"},
    adminAdd: {category: 6, desc: "管理员手动增加"},
    adminSub: {category: 7, desc: "管理员手动减少"},
}