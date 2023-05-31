'use strict'

/**
 * @swagger
 * /backend/v1/sites(查询站点):
 *   get:
 *     tags: ["site(站点)"]
 *     description: 查询站点
 *     parameters:
 *     - in: path
 *       name: offset
 *       schema:
 *         type: Number
 *     - in: path
 *       name: limit
 *       schema:
 *         type: Number
 *     - in: path
 *       name: keyword
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 返回列表
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
 *                       name:
 *                         type: string
 *                         example: 站点1
 *                       icon:
 *                         type: string
 *                         example: /static/sites/001.png
 *                       status:
 *                         type: number
 *                         example: 1-运营中
 *                       rates:
 *                         type: object
 *                         properties:
 *                           hot:
 *                             type: Number
 *                             example: 4.4
 *                           quality:
 *                             type: Number
 *                             example: 4.4
 *                       isFree:
 *                         type: boolean
 *                       added:
 *                         type: boolean
 *                       disabled:
 *                         type: boolean
 *                       url:
 *                         type: string
 *                       downloadURL:
 *                         type: string
 *                       type:
 *                         type: string
 *                         description: 模板类型
 *
 */

/**
 * @swagger
 * /backend/v1/site(添加站点):
 *   post:
 *     tags: ["site(站点)"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       name:
 *                         type: string
 *                         example: 站点1
 *                       icon:
 *                         type: string
 *                         example: /static/sites/001.png
 *                       status:
 *                         type: number
 *                         example: 1-运营中
 *                       rates:
 *                         type: object
 *                         properties:
 *                           hot:
 *                             type: Number
 *                             example: 4.4
 *                           quality:
 *                             type: Number
 *                             example: 4.4
 *                       isFree:
 *                         type: boolean
 *                       added:
 *                         type: boolean
 *                       disabled:
 *                         type: boolean
 *                       url:
 *                         type: string
 *                       downloadURL:
 *                         type: string
 *                       type:
 *                         type: string
 *                         description: 模板类型
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *
 */

/**
 * @swagger
 * /backend/v1/site/:siteId(更新站点):
 *   put:
 *     tags: ["site(站点)"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       name:
 *                         type: string
 *                         example: 站点1
 *                       icon:
 *                         type: string
 *                         example: /static/sites/001.png
 *                       status:
 *                         type: number
 *                         example: 1-运营中
 *                       rates:
 *                         type: object
 *                         properties:
 *                           hot:
 *                             type: Number
 *                             example: 4.4
 *                           quality:
 *                             type: Number
 *                             example: 4.4
 *                       isFree:
 *                         type: boolean
 *                       added:
 *                         type: boolean
 *                       disabled:
 *                         type: boolean
 *                       url:
 *                         type: string
 *                       downloadURL:
 *                         type: string
 *                       type:
 *                         type: string
 *                         description: 模板类型
 */

/**
 * @swagger
 * /backend/v1/missing/sites(站点缺失上报):
 *   get:
 *     tags: ["site(站点)"]
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                     example: 站点1
 *                   account:
 *                     type: string
 *                     example: 帐号
 *                   password:
 *                     type: string
 *                   inviteCode:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       image:
 *                         type: string
 *                         example: 上传后的地址
 *                   url:
 *                     type: object
 *                     properties:
 *                       site:
 *                         type: string
 *                         example: 网址
 *                       download:
 *                         type: string
 *                         example: 下载地址
 *                   multiAccount:
 *                     type: boolean
 *                   canSwitchAccount:
 *                     type: boolean
 *                   openType:
 *                     type: array
 *                     items:
 *                       type: number
 *                       example: 0-网页，1-app，2-微信
 *                   loginType:
 *                     type: array
 *                     items:
 *                       type: number
 *                       example: 0-密码，1-短信，2-微信
 *
 */

/**
 * @swagger
 * /backend/v1/missing/site/:siteId(站点缺失上报-处理):
 *   put:
 *     tags: ["site(站点)"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                         type: number
 *                         example: 0-正常，1-异常
 *               comment:
 *                 type: string
 */