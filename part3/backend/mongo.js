import mongoose from 'mongoose';

const password = encodeURIComponent(process.argv[2]);
const mongodbURI = `mongodb+srv://rmzerofour:${password}@cluster0.zbu2u2w.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(mongodbURI);

const Person = mongoose.model('Person', new mongoose.Schema({
    name: String,
    number: String,
}));

if (process.argv.length > 3) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person
        .save()
        .then(result => {
            console.log(`added ${result.name} with number ${result.number} to phonebook`);
            mongoose.connection.close();
        });
} else {
    Person
        .find({})
        .then(results => {
            console.log('phonebook:');
            results.forEach(person => {
                console.log(person.name, person.number);
            });
            mongoose.connection.close();
        });
}
