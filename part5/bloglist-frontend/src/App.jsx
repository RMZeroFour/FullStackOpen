import { useState, useEffect, useRef } from 'react';
import blogService from './services/blogs.js';
import LoginForm from './components/LoginForm.jsx';
import BlogsList from './components/BlogsList.jsx';
import BlogForm from './components/BlogForm.jsx';
import Toggleable from './components/Toggleable.jsx';
import './index.css';

function Notification({ message, error }) {
  return (
    <>
      {message ? <div className='notification message'>{message}</div> : null}
      {error ? <div className='notification error'>{error}</div> : null}
    </>
  );
}

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const newBlogToggleable = useRef(null);

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs.sort((a, b) => a.likes - b.likes)));
  }, []);

  useEffect(() => {
    const savedUserJson = window.localStorage.getItem('loggedInUser');
    if (savedUserJson) {
      setUser(JSON.parse(savedUserJson));
    }
  }, []);

  function onLogoutClicked() {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  }

  async function onBlogAdded(title, author, url) {
    const newBlog = await blogService.createNew(user.token, title, author, url);
    newBlogToggleable.current.toggle();
    setBlogs(blogs.concat(newBlog).sort((a, b) => a.likes - b.likes));
  }

  async function onBlogLiked(likedBlog) {
    const newBlog = await blogService.updateExisting({ ...likedBlog, likes: likedBlog.likes + 1 });
    setBlogs(blogs
      .map(blog => blog.id === newBlog.id ? newBlog : blog)
      .sort((a, b) => a.likes - b.likes)
    );
  }

  async function onBlogDeleted(deletedBlog) {
    await blogService.deleteExisting(user.token, deletedBlog.id);
    setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id));
  }

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  }

  function showError(err) {
    setError(err);
    setTimeout(() => setError(''), 5000);
  }

  if (!user) {
    return (
      <>
        <h2>log in to application</h2>
        <Notification message={message} error={error} />
        <LoginForm setUser={setUser} showError={showError} />
      </>
    );
  }

  return (
    <>
      <h2>blogs</h2>
      <Notification message={message} error={error} />
      <BlogsList blogs={blogs} username={user.username} onBlogLike={onBlogLiked} onBlogDelete={onBlogDeleted} />

      <h2>create new</h2>
      <p>
        {user.name} logged in
        <button onClick={onLogoutClicked}>logout</button>
      </p>
      <Toggleable ref={newBlogToggleable} buttonLabel='new blog'>
        <BlogForm onBlogAdd={onBlogAdded} showMessage={showMessage} showError={showError} />
      </Toggleable>
    </>
  );
}

export default App;