import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/userService.js";

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload.users;
    },
  }
});

const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;

export function fetchUsers() {
  return async function (dispatch) {
    const users = await userService.getAll();
    dispatch(setUsers({ users }));
  };
}
