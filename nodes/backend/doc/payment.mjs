'use strict'

/**
 * @swagger
 * /backend/v1/member/items(会员套餐列表):
 *   get:
 *     tags: ["商城"]
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
 *                   name:
 *                     type: string
 *                   days:
 *                     type: number
 *                   price:
 *                     type: string
 *                   originalPrice:
 *                     type: string
 *                   promotion:
 *                     type: boolean
 */

/**
 * @swagger
 * /backend/v1/member/item/add(添加会员套餐):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   days:
 *                     type: number
 *                   price:
 *                     type: number
 *                   originalPrice:
 *                     type: number
 *                   promotion:
 *                     type: boolean
 */

/**
 * @swagger
 * /backend/v1/member/item/update(更新会员套餐):
 *   post:
 *     tags: ["商城"]
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
 *                   days:
 *                     type: number
 *                   price:
 *                     type: number
 *                   originalPrice:
 *                     type: number
 *                   promotion:
 *                     type: boolean
 *
 */

/**
 * @swagger
 * /backend/v1/member/item/delete(删除会员套餐):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *
 */

/**
 * @swagger
 * /backend/v1/rice/items(米粒套餐列表):
 *   get:
 *     tags: ["商城"]
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
 *                   name:
 *                     type: string
 *                   rice:
 *                     type: number
 *                   price:
 *                     type: string
 *                   originalPrice:
 *                     type: string
 *                   promotion:
 *                     type: boolean
 */

/**
 * @swagger
 * /backend/v1/rice/item/add(添加米粒套餐):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   rice:
 *                     type: number
 *                   price:
 *                     type: number
 *                   originalPrice:
 *                     type: number
 *                   promotion:
 *                     type: boolean
 */

/**
 * @swagger
 * /backend/v1/rice/item/update(更新米粒套餐):
 *   post:
 *     tags: ["商城"]
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
 *                   rice:
 *                     type: number
 *                   price:
 *                     type: number
 *                   originalPrice:
 *                     type: number
 *                   promotion:
 *                     type: boolean
 *
 */

/**
 * @swagger
 * /backend/v1/rice/item/delete(删除米粒套餐):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *
 */

/**
 * @swagger
 * /backend/v1/api/promotion/commission/list(推广提成比例列表):
 *   get:
 *     tags: ["商城"]
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
 *                   commissionType:
 *                     type: number
 *                     example: 1-等级，2-人数
 *                   level:
 *                     type: number
 *                   peopleNumber:
 *                     type: number
 *                   rate:
 *                     type: number
 */

/**
 * @swagger
 * /backend/v1/api/promotion/commission/add(推广提成比例添加):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   commissionType:
 *                     type: number
 *                     example: 1-等级，2-人数
 *                   level:
 *                     type: number
 *                   peopleNumber:
 *                     type: number
 *                   rate:
 *                     type: number
 */

/**
 * @swagger
 * /backend/v1/api/promotion/commission/update(推广提成比例修改):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   commissionType:
 *                     type: number
 *                     example: 1-等级，2-人数
 *                   level:
 *                     type: number
 *                   peopleNumber:
 *                     type: number
 *                   rate:
 *                     type: number
 *
 */

/**
 * @swagger
 * /backend/v1/api/promotion/commission/delete(推广提成比例删除):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 */

/**
 * @swagger
 * /backend/v1/api/user/withdraw/records(用户钱包提现管理):
 *   get:
 *     tags: ["商城"]
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
 *       name: start_date
 *       schema:
 *         type: string
 *         example: 2023-04-22
 *     - in: path
 *       name: end_date
 *       schema:
 *         type: string
 *         example: 2023-04-22
 *     - in: path
 *       name: user_id
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
 *                       comment:
 *                         type: string
 *                       amount:
 *                         type: number
 *                         example: 提现金额
 *                       fee:
 *                         type: number
 *                         example: 手续费
 *                       status:
 *                         type: boolean
 *                       createdAt:
 *                         type: number
 *                         example: timestamp
 */

/**
 * @swagger
 * /backend/v1/api/wallet/records(用户钱包资金明细):
 *   get:
 *     tags: ["商城"]
 *     parameters:
 *     - in: path
 *       name: type
 *       schema:
 *         type: Number
 *         example: 0-全部，1-购买，2-提现，3-下级抽成，4-活动奖励，5-米粒消耗
 *     - in: path
 *       name: user_id
 *       schema:
 *         type: String
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
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                  type: number
 *                 items:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      type:
 *                        type: number
 *                        example: 1-member 2-withdraw 3-downLine 4-activity 5-rice
 *                      member:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                            example: 购买《vip月卡》
 *                          price:
 *                            type: number
 *                          createdAt:
 *                            type: number
 *                          remainDays:
 *                            type: number
 *                      withdraw:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                          amount:
 *                            type: number
 *                            example: number 提现金额
 *                          balance:
 *                            type: number
 *                            example: number 余额
 *                          createdAt:
 *                            type: number
 *                      downLine:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                            example: 13513626429购买vip季卡抽成
 *                          amount:
 *                            type: number
 *                            example: number 返利
 *                          balance:
 *                            type: number
 *                            example: number 余额
 *                          createdAt:
 *                            type: number
 *                      activity:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                          amount:
 *                            type: number
 *                            example: number 返利
 *                          balance:
 *                            type: number
 *                            example: number 余额
 *                          createdAt:
 *                      rice:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                            example: 购买《30天米粒》
 *                          price:
 *                            type: number
 *                          createdAt:
 *                            type: number
 *                          remainDays:
 *                            type: number
 *
 */

/**
 * @swagger
 * /backend/v1/api/withdraw/fee/setting(获取提现手续费设置):
 *   get:
 *     tags: ["商城"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: string
 *                 fee:
 *                   type: string
 */

/**
 * @swagger
 * /backend/v1/api/withdraw/fee/setting(设置提现手续费):
 *   post:
 *     tags: ["商城"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               fee:
 *                 type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: string
 *                 fee:
 *                   type: string
 */

/**
 * @swagger
 * /backend/v2/wallet/cash(添加用户余额):
 *   post:
 *     tags: ["商城", "v2"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               cash:
 *                 type: number
 */