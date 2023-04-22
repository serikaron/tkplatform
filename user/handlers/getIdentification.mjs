'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routeGetIdentification = router => {
    router.get('/user/identification', async (req, res, next) => {
        const user = await req.context.mongo.getUserById(req.headers.id)

        const data = () => {
            if (user === null || !user.hasOwnProperty("identification")) {
                return {identified: false}
            }

            return {
                identified: true,
                identification: {
                    idNo: user.identification.idNo,
                    name: user.identification.name,
                    image: user.identification.image,
                    wechat: user.contact.wechat.account,
                    qq: user.contact.qq.account
                }
            }
        }

        const d = data()
        res.tkResponse(TKResponse.Success({data: d}))
        next()
    })
}