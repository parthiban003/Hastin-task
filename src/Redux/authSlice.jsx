import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: '',
    password: '',
    isAuthenticated: false,
    error: '',
  },
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload;
      if (username === 'ebrain' && password === '123456') {
        state.isAuthenticated = true;
        state.error = '';
      } else {
        state.error = 'Invalid credentials';
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
