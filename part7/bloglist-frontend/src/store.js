import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer.js';
import blogsReducer from './reducers/blogsReducer.js';
import usersReducer from './reducers/usersReducer.js';
import notificationReducer from './reducers/notificationReducer.js';

const store = configureStore({
  reducer: {
    login: loginReducer,
    blogs: blogsReducer,
    users: usersReducer,
    notification: notificationReducer
  },
});

export default store;