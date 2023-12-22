const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
morgan.token('body', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    // console.log(req);
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.sendStatus(404).end();
    }
    // console.log("test");
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.sendStatus(204).end();
})

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }
    if (persons.find((person) => person.name === name)) {
        return res.status(400).json({ error: "Name is already taken" });
    }
    // generate a random number for id
    const id = Math.floor(Math.random() * 10000000000)

    const newPerson = {
        id: id,
        name,
        number,
    };
    persons.push(newPerson);
    res.json(newPerson);
});

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people<br> ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})