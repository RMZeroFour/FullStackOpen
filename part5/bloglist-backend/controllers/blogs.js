import express from 'express';
import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import middleware from '../utils/middleware.js';
import { TOKEN_SECRET } from '../utils/config.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: true, name: true });
    response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body;
    if (!title) {
        return response.status(400).json({ error: 'title missing' });
    } else if (!url) {
        return response.status(400).json({ error: 'url missing' });
    }

    const user = request.user;
    const newBlog = await new Blog({ title, author, url, likes: likes || 0, user: user.id }).save();
    user.blogs = user.blogs.concat(newBlog._id);
    await user.save();

    const returnedBlog = await newBlog.populate('user', { username: true, name: true });
    response.status(201).json(returnedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user;
    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
        response.status(404).end();
    } else if (blogToDelete.user.toString() !== user.id.toString()) {
        response.status(401).json({ error: 'can not delete another user\'s blog' });
    } else {
        await Blog.findByIdAndDelete(blogToDelete._id);
        user.blogs = user.blogs.filter(blog => blog._id !== blogToDelete._id);
        await user.save();
        response.status(204).end();
    }
});

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true });
    const returnedBlog = await updatedBlog.populate('user', { username: true, name: true });
    if (updatedBlog) {
        response.json(returnedBlog);
    } else {
        response.status(404).end();
    }
});

export default blogsRouter;