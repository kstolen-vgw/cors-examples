import express from 'express'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './cors.js'

const router = express()

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

router.get('/custom-headers', corsMiddleware, (req, res, next) => {
    res.setHeader('X-My-Custom-Header', 'helloWorld')

    res.sendStatus(200)
})

router.options('/user', corsMiddleware)
router.delete('/user', corsMiddleware, (req, res, next) => {
    console.log('random user deleted')
    res.status(201).send('random user deleted')
})

const PORT = 8001

router.listen(PORT, () => {
    console.log(`auth service listening on port ${PORT}`)
})
