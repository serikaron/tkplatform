'use restrict'

const routeInfo = [
    {
        url: "/backend/v1/register",
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://user:8080", url: "/v1/backend/register"}
    },
    {
        url: '/backend/v1/login',
        method: "POST",
        needAuth: false,
        service: {baseURL: "http://user:8080", url: "/v1/backend/login"}
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
]

export default routeInfo