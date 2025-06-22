import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import Person from './models/person.js';

const app = express();

app.use(express.static('dist'));

app.use(express.json());

morgan.token('body', (request, response) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(results => response.json(results));
});

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body;
    const newPerson = new Person({ name, number });
    newPerson
        .save()
        .then(result => response.json(result))
        .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(result => {
            if (result) {
                response.json(result);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const { number } = request.body;
    Person
        .findByIdAndUpdate(request.params.id, { number }, { new: true })
        .then(result => {
            if (result) {
                response.json(result);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndDelete(request.params.id)
        .then(result => response.status(204).end());
});

app.get('/info', (request, response) => {
    Person
        .countDocuments({})
        .then(result => {
            let html = `<div>Phonebook has info for ${result} people</div>`;
            html += `<div>${new Date().toString()}</div>`;
            response.send(html);
        });
});

app.use((error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
