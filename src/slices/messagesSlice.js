import { createSlice } from '@reduxjs/toolkit';
import { setChannelsData, removeChannel } from './channelsSlice.js';

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messagesData',
  initialState,
  reducers: {
    addNewMessage: (state, { payload }) => {
      state.messages.push(payload);
      console.log('State in slice', state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setChannelsData, (state, { payload }) => {
        state.messages = payload.messages;
      })
      .addCase(removeChannel, (state, { payload }) => {
        state.messages = state.messages.filter((message) => message.channelId !== payload.id);
      });
  },
});

export const { addNewMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
