import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '@mui/material';
import { fetchBlogs } from './reducers/blogsReducer.js';
import { fetchUsers } from './reducers/usersReducer.js';
import { relogIn } from './reducers/loginReducer.js';
import LoginForm from './components/LoginForm.jsx';
import Navigation from './components/Navigation.jsx';
import Notification from './components/Notification.jsx';
import UserView from './components/UserView.jsx';
import UsersView from './components/UsersView.jsx';
import BlogView from './components/BlogView.jsx';
import HomeView from './components/HomeView.jsx';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const login = useSelector(state => state.login);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    const savedUserJson = window.localStorage.getItem('loggedInUser');
    if (savedUserJson) {
      const savedUser = JSON.parse(savedUserJson);
      dispatch(relogIn(savedUser));
    }
  }, []);

  if (!login) {
    return (
      <>
        <Typography variant='h4'>
          Login to Blog App
        </Typography>

        <Notification />
        <LoginForm />
      </>
    );
  }

  return (
    <Router>
      <Navigation />

      <Container>
        <Typography variant='h4'>
          Blog App
        </Typography>

        <Notification />

        <Routes>
          <Route path='/users/:id' element={<UserView />} />
          <Route path='/users' element={<UsersView />} />
          <Route path='/blogs/:id' element={<BlogView />} />
          <Route path='/' element={<HomeView />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;