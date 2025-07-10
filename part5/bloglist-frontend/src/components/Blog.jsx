import { useState } from 'react';

function BlogContents({ blog, username, onLikeClicked, onDeleteClicked }) {
  return (
    <>
      <div>{blog.url}</div>
      <div>
        <span>likes {blog.likes}</span>
        <button onClick={onLikeClicked}>like</button>
      </div>
      <div>{blog.user.username}</div>
      {blog.user.username === username ? <button onClick={onDeleteClicked}>delete</button> : null}
    </>
  );
}

function Blog({ blog, username, onBlogLike, onBlogDelete }) {
  const [expanded, setExpanded] = useState(false);

  function onToggleClicked() {
    setExpanded(!expanded);
  }

  function onLikeClicked() {
    onBlogLike(blog);
  }

  function onDeleteClicked() {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      onBlogDelete(blog);
    }
  }

  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={onToggleClicked}>{expanded ? 'hide' : 'view'}</button>
      {expanded ? <BlogContents blog={blog} username={username} onLikeClicked={onLikeClicked} onDeleteClicked={onDeleteClicked} /> : null}
    </div>
  );
}

export default Blog;