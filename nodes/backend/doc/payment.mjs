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
 *
 *
 *
 *
 */