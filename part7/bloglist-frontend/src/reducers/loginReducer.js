import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/loginService.js";

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload.user;
    },
  }
});

const { setUser } = loginSlice.actions;

export default loginSlice.reducer;

export function logIn(username, password) {
  return async function (dispatch) {
    const user = await loginService.login(username, password);
    dispatch(setUser({ user }));
    window.localStorage.setItem('loggedInUser', JSON.stringify(user));
  };
}

export function relogIn(savedUser) {
  return async function (dispatch) {
    dispatch(setUser({ user: savedUser }));
  };
}

export function logOut() {
  return async function (dispatch) {
    dispatch(setUser({ user: null }));
    window.localStorage.setItem('loggedInUser', JSON.stringify(null));
  };
}
