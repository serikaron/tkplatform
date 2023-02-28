'use restrict'

const routeInfo = [
    {url: "/v1/captcha/require", method: "POST", needAuth: false},
    {url: '/v1/sms/send', method: "POST", needAuth: false},
    {url: "/v1/user/register", method: "POST", needAuth: false},
    {url: '/v1/user/login', method: "POST", needAuth: false},
    {url: '/v1/user/account', method: "POST", needAuth: false},
    {url: '/v1/user/password', method: "POST", needAuth: false},

    {url: "/v1/user/member", method: "GET", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/overview", method: "GET", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/overview", method: "PUT", needAuth: true, service: {baseURL: "http://user:8080"}},

    // site
    {
        url: '/v1/sites', method: "GET", needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: '/v1/sites'
        }
    },
    {url: '/v1/user/site/:siteId', method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: '/v1/user/sites', method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/:siteId", method: "PUT", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site", method: "POST", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/sites", method: "PUT", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/sites/balance", method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/:userSiteId/balance", method: "PUT", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/:userSiteId/journal/entries", method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/:userSiteId/journal/entry", method: "POST", needAuth: true, service: {baseURL: "http://site:8080"}},

    // ledger
    {url: "/v1/ledger/stores", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080", url: '/v1/stores'}},
    {url: "/v1/ledger/accounts", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/user/ledger/accounts", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/user/ledger/account", method: "POST", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {
        url: "/v1/user/ledger/account/:accountId",
        method: "PUT",
        needAuth: true,
        service: {baseURL: "http://ledger:8080"},
    },
    {url: "/v1/journal/accounts", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/user/journal/accounts", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/user/journal/account", method: "POST", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {
        url: "/v1/user/journal/account/:accountId",
        method: "PUT",
        needAuth: true,
        service: {baseURL: "http://ledger:8080"}
    },
    {
        url: "/v1/ledger/entries/:minDate/:maxDate",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://ledger:8080"}
    },
    {url: "/v1/ledger/entry/:entry", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/entry", method: "POST", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/entry/:entry", method: "PUT", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {
        url: "/v1/journal/entries/:minDate/:maxDate",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://ledger:8080"}
    },
    {url: "/v1/journal/entry/:entry", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/journal/entry", method: "POST", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/journal/entry/:entry", method: "PUT", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {
        url: "/v1/ledger/statistics/:minDate/:maxDate",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://ledger:8080"}
    },
    {
        url: "/v1/journal/statistics/:minDate/:maxDate",
        method: "GET",
        needAuth: true,
        service: {baseURL: "http://ledger:8080"}
    },
]

export default routeInfo