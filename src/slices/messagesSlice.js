import { createSlice } from '@reduxjs/toolkit';
import { setChannelsData } from './channelsSlice.js';

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messagesData',
  initialState,
  reducers: {
    addNewMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setChannelsData, (state, { payload }) => {
      state.messages = payload.messages;
    });
  },
});

export const { addNewMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
