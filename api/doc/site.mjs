'use strict'

/**
 * @swagger
 * /v1/sites(查询站点):
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
 *
 */

/**
 * @swagger
 * /v1/user/sites(查询用户站点):
 *   get:
 *     tags: ["site(站点)"]
 *     description: 结构中除了 id, site 字段以外，其余为可选项有可能为空
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   site:
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
 *                       alias:
 *                         type: string
 *                         example: 备注名
 *                   credential:
 *                     type: object
 *                     properties:
 *                       account:
 *                         type: string
 *                         example: 13902822010
 *                       password:
 *                         type: string
 *                         example: zz520818
 *                   verified:
 *                     type: boolean
 *                   account:
 *                     type: object
 *                     properties:
 *                       selected:
 *                         type: string
 *                         example: 选中的买号，如果没有或者为null则表示自动选择
 *                       list:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: 买号1
 *                   setting:
 *                     type: object
 *                     properties:
 *                       interval:
 *                         type: object
 *                         properties:
 *                           min:
 *                             type: number
 *                             example: 200(秒)
 *                           max:
 *                             type: number
 *                             example: 300(秒)
 *                       schedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             from:
 *                               type: string
 *                               example: "59:0"
 *                             to:
 *                               type: string
 *                               example: "5:0"
 *
 */

/**
 * @swagger
 * /v1/user/site(添加用户站点):
 *   post:
 *     tags: ["site(站点)"]
 *     description: 参考查询接口的返回结构
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteId:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   site:
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
 *                       alias:
 *                         type: string
 *                         example: 备注名
 *                   credential:
 *                     type: object
 *                     properties:
 *                       account:
 *                         type: string
 *                         example: 13902822010
 *                       password:
 *                         type: string
 *                         example: zz520818
 *                   verified:
 *                     type: boolean
 *                   account:
 *                     type: object
 *                     properties:
 *                       selected:
 *                         type: string
 *                         example: 选中的买号，如果没有或者为null则表示自动选择
 *                       list:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: 买号1
 *                   setting:
 *                     type: object
 *                     properties:
 *                       interval:
 *                         type: object
 *                         properties:
 *                           min:
 *                             type: number
 *                             example: 200(秒)
 *                           max:
 *                             type: number
 *                             example: 300(秒)
 *                       schedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             from:
 *                               type: string
 *                               example: "59:0"
 *                             to:
 *                               type: string
 *                               example: "5:0"
 */

/**
 * @swagger
 * /v1/user/site/:userSiteId(更新用户站点):
 *   put:
 *     tags: ["site(站点)"]
 *     description:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   site:
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
 *                       alias:
 *                         type: string
 *                         example: 备注名
 *                   credential:
 *                     type: object
 *                     properties:
 *                       account:
 *                         type: string
 *                         example: 13902822010
 *                       password:
 *                         type: string
 *                         example: zz520818
 *                   verified:
 *                     type: boolean
 *                   account:
 *                     type: object
 *                     properties:
 *                       selected:
 *                         type: string
 *                         example: 选中的买号，如果没有或者为null则表示自动选择
 *                       list:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: 买号1
 *                   setting:
 *                     type: object
 *                     properties:
 *                       interval:
 *                         type: object
 *                         properties:
 *                           min:
 *                             type: number
 *                             example: 200(秒)
 *                           max:
 *                             type: number
 *                             example: 300(秒)
 *                       schedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             from:
 *                               type: string
 *                               example: "59:0"
 *                             to:
 *                               type: string
 *                               example: "5:0"
 */

/**
 * @swagger
 * /v1/user/site/:siteId(删除站点):
 *   delete:
 *     tags: ["site(站点)"]
 */

/**
 * @swagger
 * /v1/user/site/:siteId/recommend/times(时段推荐):
 *   get:
 *     tags: ["site(站点)"]
 *     description: 时段推荐
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hour:
 *                       type: Number
 *                     rate:
 *                       type: Number
 *                       example: 0.5
 */

/**
 * @swagger
 * /v1/user/site/:siteId/setting/sync(同步设置):
 *   put:
 *     tags: ["site(站点)"]
 *     description: 同步设置
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                     type: object
 *                     properties:
 *                       interval:
 *                         type: object
 *                         properties:
 *                           sync:
 *                             type: number
 *                             example: 0-不同步，1-同步
 *                       schedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             sync:
 *                               type: number
 *                               example: 0-不同步，1-连同开关，2-仅时间
 */

/**
 * @swagger
 * /v1/user/site/:siteId/report(情况上报):
 *   post:
 *     tags: ["site(站点)"]
 *     description: 同步设置
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                       problem:
 *                         type: string
 */

/**
 * @swagger
 * /v1/site/problem/templates(问题上报模板):
 *   get:
 *     tags: ["site(站点)"]
 *     description: 问题上报模板
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: 登录异常，登录不上
 */

/**
 * @swagger
 * /v1/missing/site(缺失上报):
 *   post:
 *     tags: ["site(站点)"]
 *     description: 查询站点
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: 站点1
 *                   account:
 *                     type: string
 *                     example: 帐号
 *                   password:
 *                     type: string
 *                   inviteCode:
 *                     type: string
 *                     example: 上传后的地址
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
 *
 */

/**
 * @swagger
 * /v1/missing/sites(缺失上报-待添加):
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
 *     description: 缺失上报-待添加
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
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 站点1
 *                       status:
 *                         type: number
 *                         example: 0-正常，1-异常
 *                       comment:
 *                         type: string
 *                       thumb:
 *                         type: boolean
 *
 */

/**
 * @swagger
 * /v1/site/:siteId/records/:minDate/:maxDate(成功记录):
 *   get:
 *     tags: ["site(站点)"]
 *     description: 成功记录
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
 *                 rate:
 *                   type: number
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: number
 *                       principle:
 *                         type: number
 *                         example: 金额
 *                       commission:
 *                         type: number
 *                         example: 佣金
 *                       kept:
 *                         type: boolean
 *
 */

/**
 * @swagger
 * /v1/site/:siteId/record(成功记录):
 *   post:
 *     tags: ["site(站点)"]
 *     description: 成功记录
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       principle:
 *                         type: number
 *                         example: 金额
 *                       commission:
 *                         type: number
 *                         example: 佣金
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recordId:
 *                   type: string
 *
 */

/**
 * @swagger
 * /v1/site/:siteId/record/:recordId(成功记录):
 *   put:
 *     tags: ["site(站点)"]
 *     description: 成功记录
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       kept:
 *                         type: number
 *                         example: 1-记帐
 *
 */