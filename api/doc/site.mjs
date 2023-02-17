'use strict'

/**
 * @swagger
 * /v1/sites(查询站点):
 *   tags: ["site(站点)"]
 *   get:
 *     description: 查询站点
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
 *                   name:
 *                     type: string
 *                     example: 站点1
 *                   icon:
 *                     type: string
 example: 连接1
 *
 */

/**
 * @swagger
 * /v1/user/sites(查询用户站点):
 *   tags: ["site(站点)"]
 *   get:
 *     description: 结构中除了 id, name:站点1 icon:连接1 两个字段以外，其余为可选项有可能为空
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
 *                   name:
 *                     type: string
 *                     example: 站点1
 *                   icon:
 *                     type: string
 *                     example: 连接1
 *                   credential:
 *                     type: object
 *                     properties:
 *                       account:
 *                         type: string
 *                         example: 13902822010
 *                       password:
 *                         type: string
 *                         example: zz520818
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
 * /v1/user/sites(更新用户站点,用于保存备份时调用):
 *   tags: ["site(站点)"]
 *   put:
 *     description: 结构中除了 id, name:站点1 icon:连接1 两个字段以外，其余为可选项有可能为空
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                     example: 站点1
 *                   icon:
 *                     type: string
 *                     example: 连接1
 *                   credential:
 *                     type: object
 *                     properties:
 *                       account:
 *                         type: string
 *                         example: 13902822010
 *                       password:
 *                         type: string
 *                         example: zz520818
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
 *   tags: ["site(站点)"]
 *   post:
 *     description: 结构中除了 name:站点1 icon:连接1 两个字段以外，其余为可选项有可能为空
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: 站点1
 *                   icon:
 *                     type: string
 *                     example: 连接1
 *                   credential:
 *                     type: object
 *                     properties:
 *                       account:
 *                         type: string
 *                         example: 13902822010
 *                       password:
 *                         type: string
 *                         example: zz520818
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
 * /v1/user/site/:siteId(更新用户站点):
 *   tags: ["site(站点)"]
 *   put:
 *     description: 结构中除了 id, name:站点1, icon:连接1 两个字段以外，其余为可选项有可能为空
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                     example: 站点1
 *                   icon:
 *                     type: string
 *                     example: 连接1
 *                   credential:
 *                     type: object
 *                     properties:
 *                       account:
 *                         type: string
 *                         example: 13902822010
 *                       password:
 *                         type: string
 *                         example: zz520818
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
