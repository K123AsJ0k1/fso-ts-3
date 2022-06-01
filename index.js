require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => { 
    if (req.method === "POST") { 
        return JSON.stringify(req.body) 
    }
    return '' 
})

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    Person.countDocuments().then(count => {
        let html = `<div><p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p></div>`
        res.send(html)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person.length == 0) {
                res.status(404).end()
            }
            res.json(person)
        })
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            Person.find({}).then(persons => {
                res.json(persons)
            })
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { id, name, number } = req.body
    /*
    const person = {
        name: body.name,
        number: body.number,
    }
    */

    Person.findByIdAndUpdate(id, { name, number }, {new: true, runValidators: true, context: 'query'})
        .then(result => {
            Person.find({}).then(persons => {
                res.json(persons)
            })
        })
        .catch(error => next(error))

    /*
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(body.id, person)
        .then(result => {
            Person.find({}).then(persons => {
                res.json(persons)
            })
        })
        .catch(error => next(error))
    */

})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }

    if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})