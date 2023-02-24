'use strict'



/**
 * @swagger
 * /v1/captcha/require:
 *   post:
 *     tags: ["captcha(图形码)", "已实现"]
 *     description: 获取图形码
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: 1234
 *                     image:
 *                       type: string
 *                       example: baas64 图片字节
 *
 */
