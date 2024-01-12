import express from 'express'
import cookieParser from 'cookie-parser'

const router = express()

router.use(cookieParser())
router.use(express.static('./public'))

router.get('/api', (req, res, next) => {
   
    console.log(req.cookies)

    res.sendStatus(200)
})

const PORT = 8002

router.listen(PORT, () => {
    console.log(`service listening on ${PORT}`)
})