'use strict'


/**
 * @swagger
 * /v1/search/external/account(查号✅):
 *   post:
 *     tags: ["其它","site(站点)"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wang_wang_account:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 buyerGoodNum:
 *                   type: string
 *                   example: 买家信誉
 *                 gender:
 *                   type: string
 *                   example: 性别
 *                 fox:
 *                   type: string
 *                 wwcreatedStr:
 *                   type: string
 *                   example: 注册日期
 *                 weekCount:
 *                   type: number
 *                   example: 本周查过商家
 *                 countBefore:
 *                   type: number
 *                   example: 上周查过商家
 *                 taoling:
 *                   type: number
 *                   example: 淘龄
 *                 purchaseRecords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                 jiangNum:
 *                   type: number
 *                   example:
 *                 sentRate:
 *                   type: string
 *                 weekCreditAverage:
 *                   type: number
 *                   example: 买家总周平均
 *                 receivedRate:
 *                   type: string
 *                   example: 收到好评
 *                 yunBlack:
 *                   type: number
 *                 renZheng:
 *                   type: string
 *                 sellerTotalNum:
 *                   type: string
 *                   example: 商家信誉
 *                 badTotal:
 *                   type: string
 *
 */

/**
 * @swagger
 * /v1/system/questions(问题列表✅):
 *   get:
 *     tags: ["其它"]
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  question:
 *                    type: string
 *                  icon:
 *                    type: string
 *
 *
 */

/**
 * @swagger
 * /v1/system/question/:questionId/answer(问题详情✅):
 *   get:
 *     tags: ["其它"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 question:
 *                   type: string
 *                 icon:
 *                   type: string
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 */