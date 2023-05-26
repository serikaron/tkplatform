'use strict'

/**
 * @swagger
 * /backend/v1/system/questions(问题列表):
 *   get:
 *     tags: ["在线帮助文档管理"]
 *     parameters:
 *     - in path:
 *       name: offset
 *       type: number
 *     - in path:
 *       name: limit
 *       type: number
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
 * /backend/v1/system/question/:questionId/answer(问题详情):
 *   get:
 *     tags: ["在线帮助文档管理"]
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

/**
 * @swagger
 * /backend/v1/system/question(新建问题):
 *   post:
 *     tags: ["在线帮助文档管理"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *
 */

/**
 * @swagger
 * /backend/v1/system/question/:questionId(修改问题):
 *   put:
 *     tags: ["在线帮助文档管理"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *
 */

/**
 * @swagger
 * /backend/v1/system/question/:questionId(删除问题):
 *   delete:
 *     tags: ["在线帮助文档管理"]
 */
