import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV;

const PORT = process.env.PORT;

const MONGODB_URI = NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export { NODE_ENV, PORT, MONGODB_URI, TOKEN_SECRET };