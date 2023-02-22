'use strict'




/**
 * @swagger
 * /v1/user/register:
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
 * /v1/user/password:
 *   post:
 *     tags: ["user(用户相关)"]
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