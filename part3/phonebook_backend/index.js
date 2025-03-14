const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json());
app.use(cors());

// Custom token to log request body for POST requests
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Define a custom Morgan format
morgan.format('customFormat', ':method :url :status - :response-time ms :post-data');

app.use(morgan('customFormat'));

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>')
});

app.get('/api/persons', (req, res) => {
    res.json(persons)
});

app.get('/info', (req, res) => {
    const requestTime = new Date().toString();
    res.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <p>${requestTime}</p>            
    `)
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(400).end()
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
});

const getRandomInt = () => {
    return String(Math.floor(Math.random() * 10000));
};

app.post('/api/persons', (req, res) => {
    const body = req.body
    const checkName = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    } else {
        if (checkName) {
            return res.status(400).json({
                error: 'name must be unique'
            })
        }
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: getRandomInt(),
    }

    persons = persons.concat(newPerson)
    
    res.json(persons)
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
