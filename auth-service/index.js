import express from 'express'

const router = express()

router.get('/healthcheck', (req, res, next) => {
    res.send(200).json()
})

router.post('/login', express.json(), (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    if (!(username && password)) {
        return res.sendStatus(400)
    }

    res.sendStatus(200)
})

const PORT = 8001

router.listen(PORT, () => {
    console.log(`auth service listening on port ${PORT}`)
})
