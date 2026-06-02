require('dotenv').config();
const express = require('express');
const Person = require('./models/person');
const app = express();
const morgan = require('morgan'); //Logger middleware

app.use(express.json()); //Middleware for parsing JSON text bodies into JavaScript Object
app.use(express.static('dist')); //Middleware for serving static files from the specified directory

morgan.token('body', (req, res) => JSON.stringify(req.body)); //Custom token to log request body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')); //Custom logger output format

/***** API ENDPOINTS *****/
//GET INFO
app.get('/api/info', (req, res) => {
    Person.estimatedDocumentCount().then(count => {
        res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p>`);
    });
});
//GET ALL PERSONS
app.get('/api/persons', (req, res, next) => {
    Person.find()
        .then(persons => res.json(persons))
        .catch(err => next(err));
});
//GET A SINGLE PERSON
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(err => next(err));
});
//DELETE A PERSON
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch(err => next(err));
});
//UPDATE A PERSON
app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body;

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end();
            }

            person.name = name;
            person.number = number;

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson);
            });
        })
        .catch(error => next(error));
});
//ADD A PERSON
app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(savedPerson => {
            res.json(savedPerson);
        })
        .catch(err => next(err));
});

//Custom error handler
function errorHandler(err, req, res, next) {
    if (err.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'});
    } else if (err.name === 'ValidationError') {
        let errMessage = '';
        let counter = 0;

        Object.keys(err.errors).forEach((key) => {
            if (counter > 0) {
                errMessage += ', ';
            }
            errMessage += err.errors[key].message;
            counter++;
        });

        return res.status(400).json({error: errMessage});
    }

    next(err);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);