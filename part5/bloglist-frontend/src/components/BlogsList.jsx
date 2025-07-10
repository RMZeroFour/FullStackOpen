import Blog from './Blog.jsx';

function BlogsList({ blogs, username, onBlogLike, onBlogDelete }) {
  return (
    <>
      {blogs.map(
        blog => <Blog key={blog.id} blog={blog} username={username} onBlogLike={onBlogLike} onBlogDelete={onBlogDelete} />
      )}
    </>
  );
}

export default BlogsList;