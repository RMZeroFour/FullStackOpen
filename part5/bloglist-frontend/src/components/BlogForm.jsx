import { useState } from 'react';

function BlogForm({ onBlogAdd, showMessage, showError }) {
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
      onBlogAdd(title, author, url);
      showMessage(`added new blog ${title} by ${author}`);

      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      showError(`could not create new blog, ${error.message}`);
    }
  }

  return (
    <form onSubmit={onFormSubmitted}>
      <div>
        title:
        <input value={title} onChange={onTitleChanged} data-testid='input_title' />
      </div>
      <div>
        author:
        <input value={author} onChange={onAuthorChanged} data-testid='input_author' />
      </div>
      <div>
        url:
        <input value={url} onChange={onUrlChanged} data-testid='input_url' />
      </div>
      <button type='submit' data-testid='button_create'>create</button>
    </form>
  );
}

export default BlogForm;