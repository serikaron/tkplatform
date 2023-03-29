'use strict'

/**
 * @swagger
 * /v1/user/sites/balance(站点余额✅):
 *   get:
 *     tags: [balance(站点余额)]
 *     parameters:
 *     - in: path
 *       name: siteId
 *       schema:
 *         type: string
 *     - in: path
 *       name: key
 *       schema:
 *         type: string
 *         example: 搜索帐号s
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
 *                     example: userSiteId
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
 *                   credentialAccount:
 *                     type: string
 *                     example: 帐号(13902822010)
 *                   balance:
 *                     type: number
 */

/**
 * @swagger
 * /v1/user/site/:userSiteId/balance(更新站点余额✅):
 *   put:
 *     tags: [balance(站点余额)]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              balance:
 *                type: number
 */

/**
 * @swagger
 * /v1/user/site/:userSiteId/journal/entry(添加提现记录✅):
 *   post:
 *     tags: [balance(站点余额)]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                     type: object
 *                     properties:
 *                           name:
 *                             type: string
 *                           account:
 *                             type: string
 *                           withdrewAt:
 *                             type: number
 *                           amount:
 *                             type: number
 *
 */

/**
 * @swagger
 * /v1/user/site/journal/entries(查询提现记录✅):
 *   get:
 *     tags: [balance(站点余额)]
 *     parameters:
 *     - in: path
 *       name: userSiteId
 *       schema:
 *         type: string
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
 *                           name:
 *                             type: string
 *                           account:
 *                             type: string
 *                           withdrewAt:
 *                             type: number
 *                           amount:
 *                             type: number
 */