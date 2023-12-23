require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
    )
)

app.get('/api/persons', (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    // console.log(req);
    Person.findById(req.params.id)
        .then((person) => {
            if (person) {
                res.json(person)
            } else {
                res.sendStatus(404).end()
            }
        })
        .catch((err) => {
            next(err)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.sendStatus(204).end()
        })
        .catch((err) => {
            next(err)
        })
})

app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body
    if (!name || !number) {
        return res.status(400).json({ error: 'Name and number are required' })
    }
    const person = new Person({ name, number })
    person
        .save()
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            next(err)
        })
})

app.get('/info', (req, res) => {
    Person.find({}).then((persons) => {
        res.send(
            `Phonebook has info for ${persons.length} people<br> ${new Date()}`
        )
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
