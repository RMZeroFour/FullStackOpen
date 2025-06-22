import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message));

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => /\d{2,3}-\d+/.test(v),
            message: props => `${props.value} is not a valid phone number`
        },
    },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);

export default Person;