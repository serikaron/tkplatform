'use strict'



/**
 * @swagger
 * /v1/sms/send:
 *   post:
 *     tags: ["sms(短信服务)"]
 *     description: 发送验证码到手机
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *               captcha:
 *                  type: object
 *                  properties:
 *                    key:
 *                      type: string
 *                      example: "1234"
 *                    code:
 *                      type: string
 *                      example: "4iF9"
 *
 *     responses:
 *       200:
 *         description: 发送成功
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
 *
 */
