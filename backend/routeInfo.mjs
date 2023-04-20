'use restrict'

const routeInfo = [
    {
        url: "/backend/v1/captcha/require",
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://captcha:8080", url: "/v1/captcha/require"}
    },
    {
        url: "/backend/v1/sms/send",
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://sms:8080", url: "/v1/sms/send"}
    },
    {
        url: "/backend/v1/admin/register",
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://user:8080", url: "/v1/backend/register"}
    },
    {
        url: '/backend/v1/admin/login',
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://user:8080", url: "/v1/backend/login"}
    },
    {
        url: '/backend/v1/user/register',
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: "/v1/user/register"}
    },
    {
        url: '/backend/v1/user/:userId', method: "GET", needAuth: true, service: {
            baseURL: "http://user:8080",
            url: (req) => {
                return `/v1/backend/user/${req.params.userId}`
            }
        }
    },
    {
        url: "/backend/v1/users",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: "/v1/backend/users"}
    },
    {
        url: "/backend/v1/user/message",
        method: "POST",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: "/v1/user/message"}
    },
    {
        url: "/backend/v1/user/messages",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://user:8080", url: "/v1/backend/user/messages"}
    },
    {
        url: '/backend/v1/user/reports',
        method: 'GET',
        needAuth: true,
        service: {baseURL: 'http://user:8080', url: '/v1/backend/user/reports'}
    },
    // ------ user end -----

    {url: '/backend/v1/site', method: "POST", needAuth: true, service: {baseURL: "http://site:8080", url: '/v1/site'}},
    {
        url: '/backend/v1/sites',
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://site:8080", url: '/v1/backend/sites'}
    },
    {
        url: "/backend/v1/site/:siteId", method: "PUT", needAuth: true, service: {
            baseURL: "http://site:8080",
            url: (req) => {
                return `/v1/site/${req.params.siteId}`
            }
        }
    },
    // ----- site end -----

    {
        url: "/backend/v1/user/:userId/wallet/", method: "GET", needAuth: true, service: {
            baseURL: "http://payment:8080",
            url: (req) => {
                return `/v1/backend/user/${req.params.userId}/wallet`
            }
        }
    },
    {
        url: '/backend/v1/system/settings',
        method: 'GET',
        needAuth: true,
        service: {baseURL: 'http://system:8080', url: "/v1/system/settings"}
    },
    {
        url: '/backend/v1/system/setting',
        method: 'PUT',
        needAuth: true,
        service: {baseURL: 'http://system:8080', url: '/v1/system/setting'}
    },

    {
        url: '/backend/v1/system/versions',
        method: 'GET',
        needAuth: true,
        service: {baseURL: 'http://system:8080', url: '/v1/system/versions/all'}
    },
    {
        url: '/backend/v1/system/version',
        method: 'POST',
        needAuth: true,
        service: {baseURL: 'http://system:8080', url: '/v1/system/version'}
    },
    {
        url: '/backend/v1/system/version/:versionId',
        method: 'DELETE',
        needAuth: true,
        service: {
            baseURL: 'http://system:8080',
            url: (req) => {
                return `/v1/system/version/${req.params.versionId}`
            }
        }
    },

    // ----- question -----
    {
        url: '/backend/v1/system/questions',
        method: "GET",
        needAuth: true,
        service: {baseURL: 'http://system:8080', url: '/v1/system/backend/questions'}
    },
    {
        url: '/backend/v1/system/question/:questionId/answer',
        method: "GET",
        needAuth: true,
        service: {
            baseURL: 'http://system:8080',
            url: (req) => {
                return `/v1/system/question/${req.params.questionId}/answer`
            }
        }
    },
    {
        url: '/backend/v1/system/question',
        method: "POST",
        needAuth: true,
        service: {baseURL: 'http://system:8080', url: '/v1/system/question'}
    },
    {
        url: '/backend/v1/system/question/:questionId',
        method: "PUT",
        needAuth: true,
        service: {
            baseURL: 'http://system:8080',
            url: (req) => {
                return `/v1/system/question/${req.params.questionId}`
            }
        }
    },
    {
        url: '/backend/v1/system/question/:questionId',
        method: "DELETE",
        needAuth: true,
        service: {
            baseURL: 'http://system:8080',
            url: (req) => {
                return `/v1/system/question/${req.params.questionId}`
            }
        }
    },
    // ----- question end -----

    // ----- payment -----
    {
        url: '/backend/v1/member/items',
        method: 'GET',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/member/items'}
    },
    {
        url: '/backend/v1/member/item/add',
        method: 'POST',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/member/item/add'}
    },
    {
        url: '/backend/v1/member/item/update',
        method: 'POST',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/member/item/update'}
    },
    {
        url: '/backend/v1/member/item/delete',
        method: 'POST',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/member/item/delete'}
    },
    {
        url: '/backend/v1/rice/items',
        method: 'GET',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/rice/items'}
    },
    {
        url: '/backend/v1/rice/item/add',
        method: 'POST',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/rice/item/add'}
    },
    {
        url: '/backend/v1/rice/item/update',
        method: 'POST',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/rice/item/update'}
    },
    {
        url: '/backend/v1/rice/item/delete',
        method: 'POST',
        needAuth: true,
        service: {baseURL: 'http://apid:9010', url: '/v1/api/store/rice/item/delete'}
    },
    // ----- payment end -----
]

export default routeInfo