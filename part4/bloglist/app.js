import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_URI } from './utils/config.js';
import logger from './utils/logger.js';
import middleware from './utils/middleware.js';
import loginRouter from './controllers/login.js';
import usersRouter from './controllers/users.js';
import blogsRouter from './controllers/blogs.js';

const app = express();

logger.info('connecting to', MONGODB_URI);

mongoose
    .connect(MONGODB_URI)
    .then(() => logger.info('connected to MongoDB'))
    .catch((error) => logger.error('error connection to MongoDB:', error.message));

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;