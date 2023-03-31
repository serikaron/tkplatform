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
 *     tags: ["user(用户相关)","个人中心","已实现"]
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
 *     tags: ["user(用户相关)","个人中心","已实现"]
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
 * /v1/user/report(问题反馈):
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
 *
 */

/**
 * @swagger
 * /v1/user/reports(反馈历史):
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
 *                   其余字段:
 *                     type: 参考提交的接口
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