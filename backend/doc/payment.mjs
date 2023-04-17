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
