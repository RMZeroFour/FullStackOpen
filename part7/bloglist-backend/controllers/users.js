import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const usersRouter = express.Router();

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { url: true, title: true, author: true });
    response.json(users);
});

usersRouter.post('/', async (request, response) => {
    const { username, password, name } = request.body;
    if (!password || password.length < 3) {
        response.status(400).json({ error: 'password should be at least 3 characters' });
    } else {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await new User({ username, passwordHash, name }).save();
        response.status(201).json(newUser);
    }
});

export default usersRouter;