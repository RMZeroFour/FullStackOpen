import _ from 'lodash';

function dummy(blogs) {
    return 1;
}

function totalLikes(blogs) {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0);
}

function favoriteBlog(blogs) {
    if (blogs.length === 0) {
        return null;
    }

    let maxIndex = -1, maxLikes = -1;
    blogs.forEach((blog, i) => {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes;
            maxIndex = i;
        }
    });
    return blogs.at(maxIndex);
}

function mostBlogs(blogs) {
    if (_.isEmpty(blogs)) {
        return null;
    }
    return _(blogs)
        .groupBy(blog => blog.author)
        .map((blogs, name) => ({ author: name, blogs: blogs.length }))
        .maxBy(group => group.blogs);
}

function mostLikes(blogs) {
    if (_.isEmpty(blogs)) {
        return null;
    }
    return _(blogs)
        .groupBy(blog => blog.author)
        .map((blogs, name) => ({ author: name, likes: _(blogs).sumBy(blog => blog.likes) }))
        .maxBy(group => group.likes);
}

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };