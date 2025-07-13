import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showError } from '../reducers/notificationReducer.js';
import { logIn } from '../reducers/loginReducer.js';
import { Button, TextField } from '@mui/material';

function LoginForm() {
  const dispatch = useDispatch();

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
      dispatch(logIn(username, password));

      setUsername('');
      setPassword('');
    } catch (error) {
      dispatch(showError('wrong username or password', 5));
    }
  }

  return (
    <form onSubmit={onFormSubmitted}>
      <div>
        <TextField label='username' value={username} onChange={onUsernameChanged} data-testid='input_username' />
      </div>
      <div>
        <TextField label='password' type='password' value={password} onChange={onPasswordChanged} data-testid='input_password' />
      </div>
      <Button variant="contained" color="primary" type="submit" data-testid='button_login'>
        login
      </Button>
    </form>
  );
}

export default LoginForm;