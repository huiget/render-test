const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.bvmetzn.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log(url);

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
    console.log('phonebook:');
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
    return
}

if (process.argv.length < 5) {
    console.log('give name and number as arguments');
    process.exit(1)
}

const name = process.argv[3]

const number = process.argv[4]


const person = new Person({
    name, number
})

person.save().then(result => {
    console.log(`added ${name} number ${number} to the phonebook`)
    mongoose.connection.close()
})