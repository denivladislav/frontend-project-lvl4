/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const postLoginData = createAsyncThunk(
  'loginData/postLoginDataStatus',
  async ({ values }) => {
    const { data } = await axios.post(routes.loginPath(), values);
    return data;
  },
);

const initialState = {
  authStatus: 'initial',
  authData: null,
};

export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    setDefaultAuthStatus: (state) => {
      state.authStatus = 'initial';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLoginData.fulfilled, (state, { payload }) => {
        state.authStatus = 'success';
        state.authData = payload;
      })
      .addCase(postLoginData.rejected, (state) => {
        state.authStatus = 'error';
      });
  },
});

export const { setDefaultAuthStatus } = loginSlice.actions;

export default loginSlice.reducer;
