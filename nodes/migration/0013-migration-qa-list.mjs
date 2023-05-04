'use strict'

export const version = "0013"

export async function migrate(mongoClient) {
    await mongoClient.system.db
        .collection("questions")
        .insertMany([
            {
                question: "功能问题",
                icon: "",
                answers: [
                    {
                        title: "图标上显示处理",
                        content: "提示您在该平台有未处理的事件，导致无法抢任务。"
                    },
                    {
                        title: "什么是备用包?",
                        content: `app名称显示为"本APP-x-xx"带日期的即备用app。
                        <font color="#FE6026">备用app在登录界面“历史版本”或个人中心-设置-“历史版本”内。</font>
                        `
                    }
                ]
            },
            {
                question: "手机怎么取消禁止恶意应用",
                icon: "",
                answers: [
                    {
                        title: "华为手机",
                        content: "<a href='https://www.baidu.com'>点击查看</a>"
                    }
                ]
            }
        ])
    await mongoClient.site.db
        .collection('userSites')
        .updateMany({},
            {
                $set: {
                    "site.url": "https://www.baidu.com",
                    "site.downloadURL": "https://www.baidu.com"
                }
            }
        )
}