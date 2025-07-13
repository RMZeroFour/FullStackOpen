import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, error: null, },
  reducers: {
    setMessage(state, action) {
      state.message = action.payload.message;
    },
    setError(state, action) {
      state.error = action.payload.error;
    },
  }
});

const { setMessage, setError } = notificationSlice.actions;

export default notificationSlice.reducer;

export function showMessage(message, seconds) {
  return async function (dispatch) {
    dispatch(setMessage({ message }));
    setTimeout(() => {
      dispatch(setMessage({ message: null }));
    }, seconds * 1000);
  };
}

export function showError(error, seconds) {
  return async function (dispatch) {
    dispatch(setError({ error }));
    setTimeout(() => {
      dispatch(setError({ error: null }));
    }, seconds * 1000);
  };
}
