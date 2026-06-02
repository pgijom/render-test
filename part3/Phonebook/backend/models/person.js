const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name must be at least 3 characters long'],
        required: [true, 'You must provide a name'],
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+$/.test(v) && v.length >= 8;
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'You must provide a phone number'],
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

mongoose.set('strictQuery', false);

mongoose.connect(url, {family: 4})
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message);
    });

module.exports = mongoose.model('Person', personSchema);