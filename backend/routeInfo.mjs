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
    // ------ user end -----

    {url: '/backend/v1/site', method: "POST", needAuth: true, service: {baseURL: "http://site:8080", url: '/v1/site'}},
    {url: '/backend/v1/site', method: "GET", needAuth: true, service: {baseURL: "http://site:8080", url: '/v1/site'}},
    {url: '/backend/v1/site', method: "PUT", needAuth: true, service: {baseURL: "http://site:8080", url: '/v1/site'}},
]

export default routeInfo