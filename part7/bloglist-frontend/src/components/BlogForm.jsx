import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '../reducers/blogsReducer.js';
import { showMessage, showError } from '../reducers/notificationReducer.js';
import { Button, TextField } from '@mui/material';

function BlogForm({ onBlogAdd }) {
  const dispatch = useDispatch();

  const userToken = useSelector(state => state.login.token);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  function onTitleChanged({ target }) {
    setTitle(target.value);
  }
  function onAuthorChanged({ target }) {
    setAuthor(target.value);
  }
  function onUrlChanged({ target }) {
    setUrl(target.value);
  }

  async function onFormSubmitted(event) {
    event.preventDefault();

    try {
      const blog = { title, author, url };
      dispatch(createBlog(userToken, blog));

      dispatch(showMessage(`added new blog ${title} by ${author}`, 5));

      setTitle('');
      setAuthor('');
      setUrl('');

      onBlogAdd();
    } catch (error) {
      dispatch(showError(`could not create new blog, ${error.message}`, 5));
    }
  }

  return (
    <form onSubmit={onFormSubmitted}>
      <div>
        <TextField label='title' value={title} onChange={onTitleChanged} data-testid='input_title' />
      </div>
      <div>
        <TextField label='author' value={author} onChange={onAuthorChanged} data-testid='input_author' />
      </div>
      <div>
        <TextField label='url' value={url} onChange={onUrlChanged} data-testid='input_url' />
      </div>
      <Button variant="contained" color="primary" type="submit" data-testid='button_create'>
        create
      </Button>
    </form>
  );
}

export default BlogForm;