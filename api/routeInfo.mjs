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
    {url: "/v1/user/downLine/:downLineUserId", method: "PUT", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/downLines", method: "GET", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/centre", method: "GET", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/downLine/:downLine/claim", method: "POST", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/report/types", method: "GET", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/report", method: "POST", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/reports", method: "GET", needAuth: true, service: {baseURL: "http://user:8080"}},
    {url: "/v1/user/report/:reportId", method: "GET", needAuth: true, service: {baseURL: "http://user:8080"}},

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
    {url: "/v1/user/site/:siteId", method: "DELETE", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site", method: "POST", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/sites", method: "PUT", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/sites/balance", method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/:userSiteId/balance", method: "PUT", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/journal/entries", method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/:userSiteId/journal/entry", method: "POST", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/sites/statistics", method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/site/:userSiteId/logs", method: "GET", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/site/:userSiteId/logs", method: "POST", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: "/v1/user/site/:userSiteId/setting/sync", method: "PUT", needAuth: true, service: {baseURL: "http://site:8080"}},
    {url: '/v1/user/site/:userSiteId/report', method: "POST", needAuth: true, service: {baseURL: 'http://site:8080'}},
    {url: '/v1/site/problem/templates', method: "GET", needAuth: true, service: {baseURL: 'http://site:8080'}},
    {url: '/v1/missing/sites', method: "GET", needAuth: true, service: {baseURL: 'http://site:8080'}},
    {url: '/v1/missing/site', method: "POST", needAuth: true, service: {baseURL: 'http://site:8080'}},
    // site end

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
        url: "/v1/user/ledger/account/:accountId",
        method: "DELETE",
        needAuth: true,
        service: {baseURL: "http://ledger:8080"}
    },
    {
        url: "/v1/user/journal/account/:accountId",
        method: "DELETE",
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
    {url: "/v1/site/records/:minDate/:maxDate", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/site/:userSiteId/record", method: "POST", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/site/:userSiteId/record/:recordId", method: "PUT", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/site/:userSiteId/record/:recordId", method: "DELETE", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/sites", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/site", method: "POST", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/site/:siteId", method: "DELETE", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/templates", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/template/:templateId", method: "PUT", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/entries", method: "DELETE", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/journal/entries", method: "DELETE", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/entry/:entryId", method: "DELETE", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/journal/entry/:entryId", method: "DELETE", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/analyse/detail/:minDate/:maxDate", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/analyse/overview/:minDate/:maxDate", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/ledger/entries/count", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/journal/entries/count", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},
    {url: "/v1/site/:userSiteId/recommend", method: "GET", needAuth: true, service: {baseURL: "http://ledger:8080"}},

    {url: "/v1/store/member/items", method: "GET", needAuth: true, service: {baseURL: "http://payment:8080"}},
    {url: "/v1/store/rice/items", method: "GET", needAuth: true, service: {baseURL: "http://payment:8080"}},
    {url: "/v1/wallet", method: "GET", needAuth: true, service: {baseURL: "http://payment:8080"}},
    {url: "/v1/wallet/detail", method: "GET", needAuth: true, service: {baseURL: "http://payment:8080"}},
    {url: "/v1/wallet/overview", method: "GET", needAuth: true, service: {baseURL: "http://payment:8080"}},
    {url: "/v1/wallet/withdraw/records", method: "GET", needAuth: true, service: {baseURL: "http://payment:8080"}},

    {url: "/v1/search/external/account", method: "POST", needAuth: true, service: {baseURL: "http://apid:9010", url: '/v1/api/check'}},
    {url: "/v1/file", method: "POST", needAuth: true, service: {baseURL: "http://file:8080", url: '/v1/file'}},
]

export default routeInfo