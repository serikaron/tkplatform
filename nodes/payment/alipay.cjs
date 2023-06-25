'use strict'

const AlipaySdk = require('alipay-sdk').default
const fs = require('fs/promises')

const setupAlipay = async (req) => {
    if (req.context === undefined) {
        req.context = {}
    }
    req.context.alipay = {
        getConfig: async () => {
            const privateKey = await fs.readFile(process.env.ALIPAY_PRIVATE_KEY, 'ascii')
            const alipaySDK = new AlipaySdk({
                appId: process.env.ALIPAY_APP_ID,
                privateKey: privateKey,
                alipayRootCertPath: process.env.ALIPAY_ROOT_CERT,
                alipayPublicCertPath: process.env.ALIPAY_PUBLIC_CERT,
                appCertPath: process.env.ALIPAY_APP_CERT,
                gateway: process.env.ALIPAY_GATEWAY
            })

            return alipaySDK.config
        }
    }
}

module.exports = setupAlipay