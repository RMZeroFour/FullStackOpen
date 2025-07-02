import { MONGODB_URI } from './utils/config.js';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI);

const Blog = mongoose.model('Blog', mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
}));

if (process.argv.length > 2) {
    const blog = new Blog({
        title: process.argv[2],
        author: process.argv[3],
        url: process.argv[4],
        likes: Number.parseInt(process.argv[5]),
    });

    blog
        .save()
        .then(result => {
            console.log(`added ${blog.title} by ${blog.author}`);
            mongoose.disconnect();
        });
} else {
    Blog
        .find({})
        .then(results => {
            console.log('blogs:');
            results.forEach(blog => {
                console.log(blog.title, blog.author, blog.url, blog.likes);
            });
            mongoose.disconnect();
        });
}
