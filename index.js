require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const Hasher = require('./models/hasher')

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path: ', req.path)
    console.log('Body: ', req.body)
    console.log('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

app.get('/', (req, res) => {
    res.send('<h1>Hashers unite</h1>')
})

app.get('/api/hashers', (req, res) => {
    Hasher.find({}).then(hashers => {res.json(hashers)})
})

app.get('/api/hashers/:id', (req, res) => {
    Hasher.findById(req.params.id).then(hasher => {
        res.json(hasher)
    })
})

app.delete('/api/hashers/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/api/hashers', (req, res) => {
    const body = req.body

    if (body.hashName === undefined) {
        return res.status(400).json({ error: 'name not given'})
    }

    const hasher = new Hasher({
        hashName: body.hashName,
        mortalName: body.mortalName,   
    })

    hasher.save().then(savedHasher => {
        res.json(savedHasher)
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})