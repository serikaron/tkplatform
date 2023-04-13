'use strict'




/**
 * @swagger
 * /v1/user/register(注册✅):
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户注册
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               qq:
 *                 type: string
 *                 example: "1234567890"
 *               inviter:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *               smsCode:
 *                 type: string
 *                 example: "1234"
 *
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 *       409:
 *         description: 用户已存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: -100
 *                 msg:
 *                   type: string
 *                   example: "用户已存在"
 *
 *
 */


/**
 * @swagger
 * /v1/user/login(登录✅):
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户登录
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *               password:
 *                 type: string
 *                 example: "123456"
 *
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 *       404:
 *         description: 用户名或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: -200
 *                 msg:
 *                   type: string
 *                   example: "用户名或密码错误"
 *
 *
 */

/**
 * @swagger
 * /v1/user/password(修改密码✅):
 *   post:
 *     tags: ["user(用户相关)", "个人中心"]
 *     description: 修改密码在登录界面和用户中心都有入口，本接口两种情况都适用
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 未登录时使用
 *               oldPassword:
 *                 type: string
 *                 example: 已登录时使用
 *               newPassword:
 *                 type: string
 *                 example: "123456"
 *               smsCode:
 *                 type: string
 *                 example: "1234"
 *
 *     responses:
 *       200:
 *         description: 修改成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 */

/**
 * @swagger
 * /v1/user/account(修改帐号✅):
 *   post:
 *     tags: ["user(用户相关)", "个人中心"]
 *     description: 修改帐号在登录界面和用户中心都有入口，本接口两种情况都适用
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: 未登录时需要
 *                   password:
 *                     type: string
 *                     example: 未登录时需要
 *                   smsCode:
 *                     type: string
 *                     example: 登录之后需要
 *               new:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   smsCode:
 *                     type: string
 *
 *     responses:
 *       200:
 *         description: 修改成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 */

/**
 * @swagger
 * /v1/user/member(会员信息✅):
 *   get:
 *     tags: ["user(用户相关)"]
 *     description: 会员信息
 *     responses:
 *       200:
 *         description: 会员信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expiration:
 *                   type: number
 *                   example: 过期时间timestamp
 *
 */

/**
 * @swagger
 * /v1/user/overview(查询帐号总览✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 会员信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 phone:
 *                   type: string
 *                 name:
 *                   type: string
 *                 registeredAt:
 *                   type: number
 *                 activeDays:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     30:
 *                       type: number
 *                 rechargeCount:
 *                   type: number
 *                 member:
 *                   type: object
 *                   properties:
 *                     expiration:
 *                       type: number
 *                 siteCount:
 *                   type: number
 *                 sites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       site:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 站点1
 *                           icon:
 *                             type: string
 *                             example: /static/sites/001.png
 *                           alias:
 *                             type: string
 *                             example: 备注名
 *                 contact:
 *                   type: object
 *                   properties:
 *                     qq:
 *                       type: object
 *                       properties:
 *                         account:
 *                           type: string
 *                         open:
 *                           type: boolean
 *                     wechat:
 *                       type: object
 *                       properties:
 *                         account:
 *                           type: string
 *                         open:
 *                           type: boolean
 *                     phone:
 *                       type: object
 *                       properties:
 *                         account:
 *                           type: string
 *                         open:
 *                           type: boolean
 *
 */

/**
 * @swagger
 * /v1/user/overview(更新帐号总览✅):
 *   put:
 *     tags: ["user(用户相关)","个人中心"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 contact:
 *                   type: object
 *                   properties:
 *                     qq:
 *                       type: object
 *                       properties:
 *                         account:
 *                           type: string
 *                         open:
 *                           type: boolean
 *                     wechat:
 *                       type: object
 *                       properties:
 *                         account:
 *                           type: string
 *                         open:
 *                           type: boolean
 *                     phone:
 *                       type: object
 *                       properties:
 *                         open:
 *                           type: boolean
 *
 */

/**
 * @swagger
 * /v1/user/downLines(下线管理✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     parameters:
 *     - in: path
 *       name: phone
 *       schema:
 *         type: string
 *     - in: path
 *       name: offset
 *       schema:
 *         type: number
 *     - in: path
 *       name: limit
 *       schema:
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 筛选前的下级总人数
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       lastLoginAt:
 *                         type: number
 *                       registeredAt:
 *                         type: number
 *                       member:
 *                         type: object
 *                         properties:
 *                           expiration:
 *                             type: number
 *                       name:
 *                         type: string
 *                       alias:
 *                         type: string
 *                       claimed:
 *                         type: boolean
 *                         example: 已获得
 *
 */

/**
 * @swagger
 * /v1/user/downLine/:downLineUserId(更新下线✅):
 *   put:
 *     tags: ["user(用户相关)","个人中心"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/downLine/:downLineUserId/claim(获取拉新值✅):
 *   post:
 *     tags: ["user(用户相关)"]
 *
 */

/**
 * @swagger
 * /v1/user/report/types(问题反馈类型✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: 平台问题
 *
 */

/**
 * @swagger
 * /v1/user/report(问题反馈✅):
 *   post:
 *     tags: ["user(用户相关)","个人中心"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               site:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *               detail:
 *                 type: string
 *               screenshot:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 上传后的地址
 *               video:
 *                 type: string
 *                 example: 上传后的地址
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               parameters:
 *                 id:
 *                   type: string
 *
 *
 */

/**
 * @swagger
 * /v1/user/reports(反馈历史-问题列表✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   site:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   detail:
 *                     type: string
 *                   screenshot:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: 上传后的地址
 *                   video:
 *                     type: string
 *                     example: 上传后的地址
 *                   reportedAt:
 *                     type: number
 *                     example: timestamp
 */

/**
 * @swagger
 * /v1/user/report/:reportId(问题详情✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 site:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 detail:
 *                   type: string
 *                 screenshot:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: 上传后的地址
 *                 video:
 *                   type: string
 *                   example: 上传后的地址
 *                 reportedAt:
 *                    type: number
 *                    example: timestamp
 *
 */

/**
 * @swagger
 * /v1/user/messages(消息):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     parameters:
 *     - in: path
 *       name: offset
 *       schema:
 *         type: number
 *     - in: path
 *       name: limit
 *       schema:
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: number
 *
 */

/**
 * @swagger
 * /v1/user/centre(个人中心首页✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 member:
 *                   type: object
 *                   properties:
 *                     expiration:
 *                       type: number
 *                 identified:
 *                   type: boolean
 *                 notice:
 *                   type: array
 *                   items:
 *                     type: string
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     cash:
 *                       type: number
 *                       example: 现金
 *                     rice:
 *                       type: number
 *                       example: 米粒
 *                     invitePoint:
 *                       type: number
 *                       example: 拉新值
 *
 */

/**
 * @swagger
 * /v1/user/messages(查询消息✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     parameters:
 *     - in path:
 *       name: offset
 *       type: number
 *     - in path:
 *       name: limit
 *       type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: number
 *                       read:
 *                         type: boolean
 *
 *
 */

/**
 * @swagger
 * /v1/user/messages(全部设为已读✅):
 *   put:
 *     tags: ["user(用户相关)","个人中心"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               read:
 *                 type: boolean
 *
 */

/**
 * @swagger
 * /v1/user/messages(删除已读消息✅):
 *   delete:
 *     tags: ["user(用户相关)","个人中心"]
 *
 */

/**
 * @swagger
 * /v1/user/message/:messageId(更新消息✅):
 *   put:
 *     tags: ["user(用户相关)","个人中心"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              read:
 *                type: boolean
 *
 */

/**
 * @swagger
 * /v1/user/message/:messageId(删除消息✅):
 *   delete:
 *     tags: ["user(用户相关)","个人中心"]
 */

/**
 * @swagger
 * /v1/system/versions(历史版本✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                   url:
 *                     type: string
 *                     example: 下载地址
 *                   size:
 *                     type: number
 *                     example: 字节大小
 *                   updateLog:
 *                     type: string
 *                     example: 版本公告
 *                   constraint:
 *                     type: boolean
 */

/**
 * @swagger
 * /v1/system/version/latest(检查更新✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                   url:
 *                     type: string
 *                     example: 下载地址
 *                   size:
 *                     type: number
 *                     example: 字节大小
 *                   updateLog:
 *                     type: string
 *                     example: 版本公告
 *                   constraint:
 *                     type: boolean
 */

/**
 * @swagger
 * /v1/user/identification(实名认证✅):
 *   post:
 *     tags: ["user(用户相关)","个人中心"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idNo:
 *                 type: string
 *                 example: 身份证号
 *               name:
 *                 type: string
 *                 example: 真实姓名
 *               image:
 *                 type: string
 *                 example: 照片地址
 *               wechat:
 *                 type: string
 *               qq:
 *                 type: string
 *               force:
 *                 type: boolean
 *                 example: 跳过阿里云检测
 *     responses:
 *       200:
 *         description: 验证成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       400:
 *         description: 验证失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 10008 - 验证失败, 10009 - 已读验证过
 *                 msg:
 *                   type: string
 *
 */

/**
 * @swagger
 * /v1/user/identification(查询实名认证✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 identified:
 *                   type: boolean
 *                   example: identified=false 为未实名认证，没有identification字段s
 *                 identification:
 *                   type: object
 *                   properties:
 *                     idNo:
 *                      type: string
 *                     name:
 *                      type: string
 *                     image:
 *                      type: string
 *                     wechat:
 *                      type: string
 *                     qq:
 *                      type: string
 */