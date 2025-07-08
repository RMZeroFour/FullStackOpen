import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { TOKEN_SECRET } from '../utils/config.js';

const loginRouter = express.Router();

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const correct = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

    if (!user || !correct) {
        return response.status(401).json({ error: 'invalid username or password' });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, TOKEN_SECRET);

    response.status(200).json({
        token,
        username: user.username,
        name: user.name
    });
});

export default loginRouter;
