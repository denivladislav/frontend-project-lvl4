/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: 1,
  username: '',
};

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState,
  reducers: {
    setChannelsData: (state, { payload }) => {
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
      state.username = payload.username;
    },
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload.id;
    },
    addNewChannel: (state, { payload }) => {
      state.channels.push(payload);
      if (state.username === payload.username) {
        state.currentChannelId = payload.id;
      }
    },
    renameChannel: (state, { payload }) => {
      const currentChannel = state.channels.find((channel) => channel.id === payload.id);
      currentChannel.name = payload.name;
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload.id);
      if (state.currentChannelId === payload.id) {
        state.currentChannelId = 1;
      }
    },
  },
});

export const {
  setChannelsData, addNewChannel, setCurrentChannel, renameChannel, removeChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
