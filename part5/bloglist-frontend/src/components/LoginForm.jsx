import { useState } from 'react';
import login from '../services/login.js';

function LoginForm({ setUser, showError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function onUsernameChanged({ target }) {
    setUsername(target.value);
  }

  function onPasswordChanged({ target }) {
    setPassword(target.value);
  }

  async function onFormSubmitted(event) {
    event.preventDefault();

    try {
      const user = await login.login(username, password);

      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      showError('wrong username or password');
    }
  }

  return (
    <form onSubmit={onFormSubmitted}>
      <div>
        username
        <input value={username} onChange={onUsernameChanged} data-testid='input_username'/>
      </div>
      <div>
        password
        <input type='password' value={password} onChange={onPasswordChanged} data-testid='input_password'/>
      </div>
      <button type='submit' data-testid='button_login'>login</button>
    </form>
  );
}

export default LoginForm;