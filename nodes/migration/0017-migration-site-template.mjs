'use strict'

import {recordTypeMember, recordTypeRice} from "../payment/itemType.mjs";
import {ObjectId} from "mongodb";

export const version = "0017"

const fixSiteTemplate = async (mongoClient, name, id, template) => {
    await mongoClient.site.db
        .collection("sites")
        .updateMany(
            {"name": name},
            {
                $set: {
                    type: id,
                    template: template
                }
            }
        )
    await mongoClient.site.db
        .collection("userSites")
        .updateMany(
            {"site.name": name},
            {
                $set: {
                    "site.type": id,
                    "site.template": template
                }
            }
        )
}

const addSiteTemplate = async (mongoClient) => {
    await mongoClient.site.db
        .collection("siteTemplates")
        .insertMany([
            {
                _id: new ObjectId("643ca67884bb2a4465f4f047"),
                name: "模板1（新日日升）",
                desc: "* login: 登录\n" +
                    "* getAccount: 买号查询\n" +
                    "* setAccount: 设置买号\n" +
                    "* task: 接单\n" +
                    "* getTask: 查单\n" +
                    "* balance: 站点余额\n" +
                    "* withdraw: 自动提现"
            },
            {
                _id: new ObjectId("643ca69884bb2a4465f4f048"),
                name: "模板2（乐多多）",
                desc: "* login: 登录\n" +
                    "* getAccount: 买号查询\n" +
                    "* task: 接单\n" +
                    "* balance: 站点余额"
            },
            {
                _id: new ObjectId("643ca6b184bb2a4465f4f049"),
                name: "模板3（快麦圈）",
                desc: "* loginPage: 登录页面\n" +
                    "* login: 登录\n" +
                    "* getAccount: 买号查询\n" +
                    "* getTask: 查单\n" +
                    "* balance: 站点余额\n" +
                    "* withdraw: 自动提现"
            },
            {
                _id: new ObjectId("649cf8bf7b28731043e11ddd"),
                name: "模板5（小吉他）",
                desc: "* login: 登录\n" +
                    "* getAccount: 买号查询\n" +
                    "* task: 接单\n" +
                    "* getTask: 查单\n" +
                    "* balance: 站点余额"
            },
            {
                _id: new ObjectId("6437d4c3b0d3db516ad9fd0d"),
                name: "模板6（嗨推）",
                desc: "* login: 登录\n" +
                    "* getPlatform: 平台查询\n" +
                    "* getAccount: 买号查询\n" +
                    "* task: 接单\n" +
                    "* balance: 站点余额\n" +
                    "* withdrawWay: 提现方式\n" +
                    "* withdraw: 提现"
            },
            {
                _id: new ObjectId("6437d4dab0d3db516ad9fd0e"),
                name: "模板7（新世界）",
                desc: "* login: 登录\n" +
                    "* getAccount: 买号查询\n" +
                    "* task: 接单\n" +
                    "* balance: 站点余额"
            },
        ])
}

export async function migrate(mongoClient) {
    await addSiteTemplate(mongoClient)
    await fixSiteTemplate(mongoClient, "新日日升", "6437d4dab0d3db516ad9fd0e",
        {
            "loginURL": "http://user.xinrisheng1688.com/index.php/User/Public/login/",
            "loginParams": [
                "username",
                "password"
            ],
            "getAccountURL": "http://user.xinrisheng1688.com/index.php/User/Account/getplatforminfo/",
            "getAccountParams": [
                "username",
                "userid"
            ],
            "setAccountURL": "http://user.xinrisheng1688.com/index.php/User/Account/postplatforminfo/",
            "setAccountParams": [
                "username",
                "userid",
                "id",
                "flag"
            ],
            "taskURL": "http://user.xinrisheng1688.com/index.php/User/Task/ordernum/",
            "taskParams": [
                "username",
                "userid"
            ],
            "getTaskURL": "http://user.xinrisheng1688.com/index.php/User/Task/getorderlist/",
            "getTaskParams": [
                "username",
                "userid",
                "status",
                "pt_id"
            ],
            "balanceURL": "http://user.xinrisheng1688.com/index.php/User/Api/getmember/",
            "balanceParams": [
                "username",
                "userid"
            ],
            "withdrawURL": "http://user.xinrisheng1688.com/index.php/User/Pay/posttx/",
            "withdrawParams": [
                "username",
                "password",
                "userid",
                "tixian_type",
                "price"
            ]
        }
    )

    await fixSiteTemplate(mongoClient, "乐多多", "643ca69884bb2a4465f4f048",
        {
            "loginURL": "http://h5.xiaoyatui1688.cn/app/login",
            "loginParams": [
                "username",
                "password",
                "userType"
            ],
            "getAccountURL": "http://h5.xiaoyatui1688.cn/app/showBuyAccount",
            "getAccountParams": [
                "platform_id",
                "user_id",
                "pageSize",
                "curPage"
            ],
            "taskURL": "http://h5.xiaoyatui1688.cn/app/appTaskYj",
            "taskParams": [],
            "balanceURL": "http://h5.xiaoyatui1688.cn/app/manager/getManagerInfo",
            "balanceParams": [
                "user_id"
            ]
        })

    await fixSiteTemplate(mongoClient, "快麦圈", "643ca6b184bb2a4465f4f049",
        {
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
        })

    await fixSiteTemplate(mongoClient, "小吉他", "649cf8bf7b28731043e11ddd",
        {
            "loginURL": "https://wap.60105114.com/mobile/Login.aspx",
            "loginParams": [
                "mobile",
                "password"
            ],
            "getAccountURL": "https://wap.60105114.com/Mobile/AutoTask.aspx",
            "getAccountParams": [
                "U"
            ],
            "taskURL": "https://wap.60105114.com/Mobile/API/V1/AutoTask",
            "taskParams": [
                "vaptcha_token"
            ],
            "getTaskURL": "https://wap.60105114.com/mobile/Step1.aspx",
            "getTaskParams": ["taskId", "taskDetailId"],
            "balanceURL": "https://wap.60105114.com/mobile/index.aspx"
        })

    await fixSiteTemplate(mongoClient, "嗨推", "6437d4c3b0d3db516ad9fd0d",
        {
            "loginURL": "https://mai.kaiguo.vip/api.php/user/login",
            "loginParams": [
                "phone",
                "type",
                "pwd",
                "sign"
            ],
            "getPlatformURL": "https://mai.kaiguo.vip/api.php/platform/getList",
            "getPlatformParams": [
                "uid",
                "time",
                "sign"
            ],
            "getAccountURL": "https://mai.kaiguo.vip/api.php/Member/getList",
            "getAccountParams": [
                "uid",
                "pid",
                "state",
                "time",
                "sign"
            ],
            "taskURL": "https://mai.kaiguo.vip/api.php/task/receiving",
            "taskParams": [
                "aids",
                "pid",
                "uid",
                "token",
                "sign"
            ],
            "balanceURL": "https://mai.kaiguo.vip/api.php/index/index",
            "balanceParams": [
                "uid",
                "token",
                "sign"
            ],
            "withdrawWayURL": "https://mai.kaiguo.vip/api.php/Cash/info/",
            "withdrawWayParams": [
                "uid",
                "token",
                "sign"
            ],
            "withdrawURL": "https://mai.kaiguo.vip/api.php/cash/cash/",
            "withdrawParmas": ["money", "pwd", "way", "account", "uid", "token", "sign"]
        })

    await fixSiteTemplate(mongoClient, "新世界", "6437d4dab0d3db516ad9fd0e",
        {
            "loginURL": "http://user.wawaq.cn/ksy/api/shokey/login",
            "loginParams": [
                "mobile",
                "password"
            ],
            "getAccountURL": "http://user.wawaq.cn/ksy/api/shokey/accountList",
            "getAccountParmas": [
                "userNo"
            ],
            "taskURL": "http://user.wawaq.cn/ksy/api/shokey/task/matchOrder",
            "taskParams": [
                "token",
                "userNo",
                "accId",
                "orderType",
                "key"
            ],
            "balanceURL": "http://user.wawaq.cn/ksy/api/shokey/info/",
            "balanceParams": ["userNo"]
        })
}