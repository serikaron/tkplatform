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
]

export default routeInfo