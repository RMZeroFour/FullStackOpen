import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from './logger.js';
import { TOKEN_SECRET } from './config.js';

function requestLogger(request, response, next) {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
}

async function userExtractor(request, response, next) {
    const auth = request.get('Authorization') || '';
    request.token = auth.replace('Bearer ', '');
    const decodedToken = jwt.verify(request.token, TOKEN_SECRET);
    request.user = await User.findById(decodedToken.id);
    next();
}

function unknownEndpoint(request, response) {
    response.status(404).send({ error: 'unknown endpoint' })
}

function errorHandler(error, request, response, next) {
    logger.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'username must be unique' });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }
    next(error);
}

export default { requestLogger, userExtractor, unknownEndpoint, errorHandler };