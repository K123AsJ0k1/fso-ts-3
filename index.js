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

/*
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
*/

/*
let persons = Person.find({}).then(notes => { 
    //mongoose.connection.close() 
    //console.log(result)
    return notes
})
*/

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})
/*
app.get('/info', (req, res) => {
    let html = `<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p></div>`
    res.send(html)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(person => person.id === id)
    if (person.length == 0) {
        res.status(404).end()
    }
    res.json(person)
})

const randomId = (min, max) => {
    return Math.floor(Math.random()*(max-min))+ min
}
*/

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    /*
    const same_name = persons.filter(person => person.name == body.name)

    if (same_name.length == 1) {
        return res.status(403).json({
            error: 'name must be unique'
        })
    }
    */

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    //persons = persons.concat(person)

    person.save().then(savedPerson => {
        Person.find({}).then(persons => {
            res.json(persons)
        })
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})