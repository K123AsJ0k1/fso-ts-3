const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const database = 'phonebook'
const url = `mongodb+srv://fullstack:${password}@cluster0.dehqzkm.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose.connect(url)

const personShema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personShema)

/*
const person = new Person({
    name: 'Hello',
    number: '12345'
})


person.save().then(result => {
    //console.log(`added ${person.name} number ${person.number} to ${database}`)
    console.log('Person saved!')
    mongoose.connection.close()
})
*/

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log(process.argv.length)
        console.log(`${database}:`)
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length == 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to ${database}`)
        mongoose.connection.close()
    })
}

