'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetProblemTemplates = router => {
    router.get('/site/problem/templates', (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: [
                "登录异常，登录不上",
                "抢不到单，官网可以",
                "我的帐号密码显示错误",
                "平台模式变化，请立即修复",
            ]
        }))
        next()
    })
}