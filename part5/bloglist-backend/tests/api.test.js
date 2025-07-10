import { test, after, beforeEach, describe } from 'node:test';
import { strictEqual } from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

const api = supertest(app);

const initialData = [
    {
        username: 'spongebob',
        password: 'abc',
        name: 'Spongebob Squarepants',
        blogs: [
            {
                title: 'On Krabby Patties',
                author: 'Spongbob Squarepants',
                url: 'https://krustykrab.com/1.html',
                likes: 7,
            },
        ]
    },
    {
        username: 'patrick',
        password: 'def',
        name: 'Patrick Star',
        blogs: [
            {
                title: 'The Rock I Live Under',
                author: 'Patrick Star',
                url: 'https://iampatrick.com/1.html',
                likes: 3,
            },
        ]
    },
    {
        username: 'squidward',
        password: 'ghi',
        name: 'Squidward Tentacles',
        blogs: [
            {
                title: 'Spongebob Sucks!',
                author: 'Squidward',
                url: 'http://squidward.tentacles.org/2.html',
                likes: 12,
            },
        ]
    }
];

beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    for (const data of initialData) {
        const user = new User({
            username: data.username,
            passwordHash: await bcrypt.hash(data.password, 10),
            name: data.name,
        });
        const savedUser = await user.save();

        const savedBlogs = await Promise.all(data.blogs.map(blogData => {
            const blog = new Blog({ ...blogData, user: savedUser._id });
            return blog.save();
        }));

        savedUser.blogs = savedBlogs.map(blog => blog._id);
        await savedUser.save();
    }
});

describe('blogs api', () => {
    test('correct number of blogs are returned as json', async () => {
        const req = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        strictEqual(req.body.length, 3);
    });

    test('blogs have id attribute', async () => {
        const req = await api.get('/api/blogs');
        req.body.forEach(blog => {
            strictEqual(blog.hasOwnProperty('id'), true);
        });
    });
});

describe('new blogs', () => {
    test('are saved correctly', async () => {
        const initialBlogs = (await api.get('/api/blogs')).body;

        const newBlog = {
            title: 'A',
            author: 'B',
            url: 'C',
            likes: 10,
        };

        const token = (await api
            .post('/api/login')
            .send({ username: 'spongebob', password: 'abc' })).body.token;

        await api
            .post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.length, initialBlogs.length + 1);
        strictEqual(finalBlogs.some(blog =>
            blog.title === newBlog.title && blog.author === newBlog.author &&
            blog.url === newBlog.url && blog.likes === newBlog.likes), true);
    });

    test('have 0 likes when not sepcified', async () => {
        const initialBlogs = (await api.get('/api/blogs')).body;

        const newBlog = {
            title: 'A',
            author: 'B',
            url: 'C',
        };

        const token = (await api
            .post('/api/login')
            .send({ username: 'spongebob', password: 'abc' })).body.token;

        await api
            .post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.length, initialBlogs.length + 1);
        strictEqual(finalBlogs.some(blog =>
            blog.title === newBlog.title && blog.author === newBlog.author &&
            blog.url === newBlog.url && blog.likes === 0), true);
    });

    test('fail when title or url are missing', async () => {
        const initialBlogs = (await api.get('/api/blogs')).body;

        const newBlog = {
            author: 'B',
            likes: 10
        };

        const token = (await api
            .post('/api/login')
            .send({ username: 'spongebob', password: 'abc' })).body.token;

        await api
            .post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.length, initialBlogs.length);
    });

    test('fail when token is not provided', async () => {
        const initialBlogs = (await api.get('/api/blogs')).body;

        const newBlog = {
            title: 'abc',
            author: 'B',
            url: 'xyz',
            likes: 10
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect({ error: 'token invalid' });

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.length, initialBlogs.length);
    });
});

describe('deleting blogs', () => {
    test('works for correct ids', async () => {
        const initialBlogs = (await api.get('/api/blogs')).body;

        const newBlog = {
            title: 'A',
            author: 'B',
            url: 'C',
        };

        const token = (await api
            .post('/api/login')
            .send({ username: 'spongebob', password: 'abc' })).body.token;

        const res = await api
            .post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(newBlog);
        const id = res.body.id;

        await api
            .delete(`/api/blogs/${id}`)
            .auth(token, { type: 'bearer' })
            .expect(204);

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.length, initialBlogs.length);
        strictEqual(finalBlogs.indexOf(blog => blog.id === id), -1);
    });

    test('fails for wrong ids', async () => {
        const initialBlogs = (await api.get('/api/blogs')).body;

        const token = (await api
            .post('/api/login')
            .send({ username: 'spongebob', password: 'abc' })).body.token;

        const id = '686535df3af882b9386394dc';
        await api
            .delete(`/api/blogs/${id}`)
            .auth(token, { type: 'bearer' })
            .expect(404);

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.length, initialBlogs.length);
    });
});

describe('updating blog likes', () => {
    test('works for correct ids', async () => {
        const initialBlogs = (await api.get('/api/blogs')).body;
        const firstBlog = initialBlogs[0];

        await api
            .put(`/api/blogs/${firstBlog.id}`)
            .send({ likes: 10000 })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.find(blog => blog.id === firstBlog.id).likes, 10000);
    });

    test('fails for wrong ids', async () => {
        await api
            .put(`/api/blogs/6858077a9cdb6e12ad1f9c45`)
            .send({ likes: 10000 })
            .expect(404);

        const finalBlogs = (await api.get('/api/blogs')).body;

        strictEqual(finalBlogs.some(blog => blog.likes === 10000), false);
    });
});

describe('new users', () => {
    test('are not created if username already exists', async () => {
        const usersBefore = (await api.get('/api/users')).body;

        const newUser = {
            username: "spongebob",
            password: "abc",
            name: "test",
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAfter = (await api.get('/api/users')).body;

        strictEqual(usersBefore.length, usersAfter.length);
    });

    test('are not created if username is too short', async () => {
        const usersBefore = (await api.get('/api/users')).body;

        const newUser = {
            username: "a",
            password: "12345",
            name: "test",
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAfter = (await api.get('/api/users')).body;

        strictEqual(usersBefore.length, usersAfter.length);
    });

    test('are not created if username is missing', async () => {
        const usersBefore = (await api.get('/api/users')).body;

        const newUser = {
            password: "12345",
            name: "test",
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAfter = (await api.get('/api/users')).body;

        strictEqual(usersBefore.length, usersAfter.length);
    });

    test('are not created if password is too short', async () => {
        const usersBefore = (await api.get('/api/users')).body;

        const newUser = {
            username: "abcde",
            password: "1",
            name: "test",
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAfter = (await api.get('/api/users')).body;

        strictEqual(usersBefore.length, usersAfter.length);
    });

    test('are not created if password is missing', async () => {
        const usersBefore = (await api.get('/api/users')).body;

        const newUser = {
            username: "abcde",
            name: "test",
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAfter = (await api.get('/api/users')).body;

        strictEqual(usersBefore.length, usersAfter.length);
    });
});

after(async () => await mongoose.disconnect());
