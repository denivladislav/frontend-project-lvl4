/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { fetchChatData, removeChannel } from './channelsSlice.js';

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
    builder
      .addCase(fetchChatData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      })
      .addCase(removeChannel, (state, { payload }) => {
        state.messages = state.messages.filter((message) => message.channelId !== payload.id);
      });
  },
});

export const { addNewMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
