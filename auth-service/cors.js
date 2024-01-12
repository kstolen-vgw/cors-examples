
const vary = (res, value) => {
    const updatedHeader = res.getHeader('Vary') ? res.getHeader('Vary') + `,${value}` : value
    
    res.setHeader('Vary', updatedHeader)
}

const allowOrigins = (req, res) => { 
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8002')

    // const knownOrigins = [
    //     'http://localhost:8002',
    //     'https://my.dev.site.com'
    // ]

    // const requestOrigin = req.get('origin')
    // if (knownOrigins.includes(requestOrigin)) {
    //     res.setHeader('access-control-allow-origin', requestOrigin)
    //     vary(res, 'Origin')   
    // }
}

const allowHeaders = (req, res) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const allowCredentials = (res) => {
    res.setHeader('access-control-allow-credentials', 'true')
}

const exposeHeaders = (res) => {
    res.setHeader('access-control-expose-headers', 'X-My-Custom-Header')
}

const allowMethods = (res) => {
    const allowedMethods = [
        'DELETE' 
    ].join(',')
    
    res.setHeader('access-control-allow-methods', allowedMethods)
}

export const corsMiddleware = (req, res, next) => {
    allowOrigins(req, res)
    allowCredentials(res)
    allowHeaders(req, res)
    allowMethods(res)
    exposeHeaders(res)

    next()
}
