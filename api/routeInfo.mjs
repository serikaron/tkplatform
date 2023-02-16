'use restrict'

const routeInfo = [
    {url: "/v1/captcha/require", method: "POST", needAuth: false},
    {url: '/v1/sms/send', method: "POST", needAuth: false},
    {url: "/v1/user/register", method: "POST", needAuth: false},
    {url: '/v1/user/login', method: "POST", needAuth: false},

    {url: '/v1/user/account', method: "POST", needAuth: true},
    {url: '/v1/user/password', method: "POST", needAuth: true},

    // settings
    {
        url: '/v1/sites', method: "GET", needAuth: true,
        service: {
            baseURL: "http://site:8080",
            url: '/v1/sites'
        }
    },
    {
        url: '/v1/user/:userID/sites', method: "GET", needAuth: true,
        service: {
            baseURL: "http://site:8080",
        }
    }
]

export default routeInfo