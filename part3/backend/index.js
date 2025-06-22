import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.static('dist'));

app.use(express.json());

morgan.token('body', (request, response) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;

    if (!name) {
        response.status(400).json({ 
            error: 'name missing or empty'
        });
    } else if (!number) {
        response.status(400).json({ 
            error: 'number missing or empty'
        });
    } else if (persons.find(p => p.name === name)) {
        response.status(400).json({ 
            error: 'name must be unique'
        });
    } else {
        const newPerson = { id: Math.floor(Math.random() * 127), name, number };
        persons = persons.concat(newPerson);
        response.json(newPerson);
    }
});

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === request.params.id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(p => p.id !== request.params.id);
    response.status(204).end();
});

app.get('/info', (request, response) => {
    let html = `<div>Phonebook has info for ${persons.length} people</div>`;
    html += `<div>${new Date().toString()}</div>`;
    response.send(html);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});