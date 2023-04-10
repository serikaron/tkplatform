'use strict'




/**
 * @swagger
 * /backend/v1/user/register(注册):
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户注册
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
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
 *
 */


/**
 * @swagger
 * /backend/v1/user/login(登录):
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户登录
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
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
 *
 */

/**
 * @swagger
 * /backend/v1/users(查询用户):
 *   get:
 *     tags: ["user(用户相关)"]
 *     parameters:
 *     - in: path
 *       name: offset
 *       schema:
 *         type: Number
 *     - in: path
 *       name: limit
 *       schema:
 *         type: Number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 offset:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       member:
 *                         type: object
 *                         properties:
 *                           expiration:
 *                             type: number
 *                             example: 会员过期时间
 *                       registeredAt:
 *                         type: string
 *                         example: 注册时间
 *                       upLine:
 *                         type: string
 *                         example: 上线uid
 *                       downLines:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *
 */

/**
 * @swagger
 * /backend/v1/user/:userId(查询用户):
 *   get:
 *     tags: ["user(用户相关)"]
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
 *                       example: 会员过期时间
 *                 registeredAt:
 *                   type: string
 *                   example: 注册时间
 *                 upLine:
 *                   type: string
 *                   example: 上线uid
 *                 downLines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *
 *
 */

/**
 * @swagger
 * /backend/v1/user/:userId/wallet("余额信息"):
 *   get:
 *     tags: ["user(用户相关)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
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
 *
 *
 */

/**
 * @swagger
 * /backend/v1/system/settings("配置查询"):
 *   get:
 *     tags: ['系统配置']
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   value:
 *                     type: any
 *
 */

/**
 * @swagger
 * /backend/v1/system/setting("更新配置"):
 *   put:
 *     tags: ['系统配置']
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   value:
 *                     type: any
 *
 */