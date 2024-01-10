import express from 'express'
import cookieParser from 'cookie-parser'

const router = express()

const updateVaryHeader = (res, value) => {
    const updatedHeader = res.getHeader('Vary') ? res.getHeader('Vary') + `,${value}` : value
    
    res.setHeader('Vary', updatedHeader)
}
const allowOrigins = (req, res) => { 
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8002')

    const knownOrigins = [
        'http://localhost:8002',
        'https://my.dev.site.com'
    ]

    const requestOrigin = req.get('origin')
    if (knownOrigins.includes(requestOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin)
        updateVaryHeader(res, 'Origin')
        return true
    }

    return false
}

const allowHeaders = (req, res) => {
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method.toUpperCase() === 'OPTIONS') {
        const requestHeaders = req.headers['access-control-request-headers'];
        if (requestHeaders ) 
            res.setHeader('Access-Control-Allow-Headers', requestHeaders)
        updateVaryHeader(res, 'Access-Control-Request-Headers')
    }
}

const allowCredentials = (res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
}

const allowMethods = (req, res) => {
    if (req.method.toUpperCase() === 'OPTIONS') {
        const allowedMethods = [
            'GET',
            'POST',
            'OPTIONS'
        ]
        
        res.setHeader('Access-Control-Allow-Methods',allowedMethods.join(','))
    
        return allowedMethods.includes(req.method.toUpperCase())
    }

    return true
}

const corsMiddleware = (req, res, next) => {
    allowCredentials(res)
    allowHeaders(req, res)

    if (allowOrigins(req, res) && allowMethods(req, res)) 
        next()
}

router.use(cookieParser())


router.get('/healthcheck', corsMiddleware, (req, res, next) => {
    res.status(200).send('hello')
})

router.options('/login', corsMiddleware)
router.post('/login', express.json(), corsMiddleware, (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    if (!(username && password)) {
        return res.sendStatus(400)
    }

    res.cookie('custom-auth-cookie', 'why-hello-there', {
        secure: false,
        httpOnly: true,
        maxAge: 1_000_000,
    })

    res.status(200).send('Login OK')
})

router.post('/logout', corsMiddleware, (req, res, next) => {
    res.clearCookie('custom-auth-cookie')

    res.status(200).send('logged out')
})

router.get('/authenticated-endpoint', corsMiddleware, (req, res, next) => {
    const authCookie = req.cookies['custom-auth-cookie']

    if (!authCookie) {
        return res.status(401).send('unauthenticated request')
    }

    res.status(200).json({
        givenName: 'John',
        surname: 'Doe',
    })
})

const PORT = 8001

router.listen(PORT, () => {
    console.log(`auth service listening on port ${PORT}`)
})
