import { test, describe } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';
import list_helper from '../utils/list_helper.js';

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
];

test('dummy returns one', () => {
    const blogs = [];
    const result = list_helper.dummy(blogs);
    strictEqual(result, 1);
});

describe('total likes', () => {
    test('when list has no blogs', () => {
        const result = list_helper.totalLikes([]);
        strictEqual(result, 0);
    });

    test('when list has only one blog', () => {
        const result = list_helper.totalLikes([blogs[0]]);
        strictEqual(result, 7);
    });

    test('when list has many blogs', () => {
        const result = list_helper.totalLikes(blogs);
        strictEqual(result, 36);
    });
});

describe('favorite blogs', () => {
    const listWithNoBlogs = [];
    const listWithOneBlog = [blogs[0]];
    const listWithManyBlogs = blogs;

    test('when list has no blogs', () => {
        const result = list_helper.favoriteBlog([]);
        deepStrictEqual(result, null);
    });

    test('when list has only one blog', () => {
        const result = list_helper.favoriteBlog([blogs[0]]);
        deepStrictEqual(result, blogs[0]);
    });

    test('when list has many blogs', () => {
        const result = list_helper.favoriteBlog(blogs);
        deepStrictEqual(result, blogs[2]);
    });
});

describe('most blogs', () => {
    const listWithNoBlogs = [];
    const listWithOneBlog = [blogs[0]];
    const listWithManyBlogs = blogs;

    test('when list has no blogs', () => {
        const result = list_helper.mostBlogs([]);
        deepStrictEqual(result, null);
    });

    test('when list has only one blog', () => {
        const result = list_helper.mostBlogs([blogs[0]]);
        deepStrictEqual(result, {
            author: 'Michael Chan',
            blogs: 1,
        });
    });

    test('when list has many blogs', () => {
        const result = list_helper.mostBlogs(blogs);
        deepStrictEqual(result, {
            author: 'Robert C. Martin',
            blogs: 3,
        });
    });
});

describe('most likes', () => {
    const listWithNoBlogs = [];
    const listWithOneBlog = [blogs[0]];
    const listWithManyBlogs = blogs;

    test('when list has no blogs', () => {
        const result = list_helper.mostLikes([]);
        deepStrictEqual(result, null);
    });

    test('when list has only one blog', () => {
        const result = list_helper.mostLikes([blogs[0]]);
        deepStrictEqual(result, {
            author: 'Michael Chan',
            likes: 7,
        });
    });

    test('when list has many blogs', () => {
        const result = list_helper.mostLikes(blogs);
        deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17,
        });
    });
});