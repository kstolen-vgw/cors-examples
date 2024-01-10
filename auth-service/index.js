import express from 'express'
import cookieParser from 'cookie-parser'

const router = express()

router.get('/healthcheck', (req, res, next) => {
    res.send(200).json()
})

const allowAllOrigins = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.get('origin') ?? 'localhost')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
}

router.use(cookieParser())

router.options('/login', allowAllOrigins)
router.post('/login', express.json(), allowAllOrigins, (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    if (!(username && password)) {
        return res.sendStatus(400)
    }

    res.cookie('custom-auth-cookie', 'why-hello-there', {
        secure: false,
        httpOnly: true,
        maxAge: 1_000_000
    })

    res.status(200).send('Login OK')
})

router.post('/logout', allowAllOrigins, (req, res, next) => {
    res.clearCookie('custom-auth-cookie')

    res.status(200).send('logged out')
})

router.get('/authenticated-endpoint', allowAllOrigins, (req, res, next) => {
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
