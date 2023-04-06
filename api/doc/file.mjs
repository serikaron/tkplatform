'use strict'

/**
 * @swagger
 * /v1/file(上传文件):
 *   post:
 *     tags: ["user(用户相关)","个人中心"]
 *     parameters:
 *     - in: formData
 *       name: image
 *       type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *
 *
 */