require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Phonebook_Entry = require('./models/pb_entry')

const app = express()

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
  }
  
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') { // This happens when the ID format is invalid
        return res.status(400).send({ error: 'malformatted id'}) // Respond with a 400 error
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
  
    next(error)
}

// Custom token to log request body for POST requests
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
})

// Define a custom Morgan format
morgan.format('customFormat', ':method :url :status - :response-time ms :post-data');


app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
app.use(morgan('customFormat'));


app.get('/', (req, res) => {
    res.send('<h1>Main page</h1>')
})

app.get('/api/persons', (req, res) => {
    Phonebook_Entry.find({}).then(entries => {
        res.json(entries)
    })
})


app.get('/info', (req, res) => {
    const requestTime = new Date().toString();
    
    Phonebook_Entry.countDocuments({})
        .then(count => {
            console.log('Count databalse: ', count)
            res.send(`
                <div>Phonebook has info for ${count} people</div>
                <p>${requestTime}</p>
            `)
    })
})


app.get('/api/persons/:id', (req, res, next) => {
    Phonebook_Entry.findById(req.params.id).
        then(entry => {
            if (entry) {
                res.json(entry)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
    Phonebook_Entry.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
    const body = req.body
    //const checkName = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }
    
    const entry = new Phonebook_Entry({
        name: body.name,
        number: body.number,
    })

    entry.save()
        .then(savedEntry => {
            res.json(savedEntry)
            console.log('Saved sucessfully')
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Phonebook_Entry.findById(req.params.id)
        .then(entry => {
            if (!entry) {
                return res.status(404).end()
            }

            entry.name = name
            entry.number = number

            return entry.save().then(updatedEntry => {
                res.json(updatedEntry)
            })
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// handler of requests with result to errors
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
