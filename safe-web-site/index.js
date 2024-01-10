import express from 'express'

const router = express()

router.use(express.static('./public'))

const PORT = 8002

router.listen(PORT, () => {
    console.log(`service listening on ${PORT}`)
})