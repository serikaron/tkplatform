'use strict'




/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     tags: ["user(用户相关)", "已实现"]
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
 *                   phone:
 *                     type: string
 *                     example: "13444444444"
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
 * /v1/user/login:
 *   post:
 *     tags: ["user(用户相关)", "已实现"]
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
 * /v1/user/password:
 *   post:
 *     tags: ["user(用户相关)", "已实现"]
 *     description: 修改密码
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
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
 * /v1/user/account:
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 修改帐号
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
 *                     example: "13333333333"
 *                   password:
 *                     type: string
 *                     example: "123456"
 *               new:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: "14444444444"
 *                   password:
 *                     type: string
 *                     example: "123456"
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
 * /v1/user/member(会员信息):
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
 * /v1/user/overview(查询帐号总览):
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
 * /v1/user/overview(更新帐号总览):
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
 * /v1/user/downLines(下线管理):
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
 *                       lastLogin:
 *                         type: number
 *                       registeredAt:
 *                         type: number
 *                       memberExpiration:
 *                         type: number
 *                       name:
 *                         type: string
 *                       alias:
 *                         type: string
 *
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