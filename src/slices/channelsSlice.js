import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: 0,
};

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState,
  reducers: {
    setChannelsData: (state, { payload }) => {
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    },
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload.id;
    },
    addNewChannel: (state, { payload }) => {
      state.channels.push(payload);
      state.currentChannelId = payload.id;
    },
    renameChannel: (state, { payload }) => {
      console.log('rename in slice!');
      const currentChannel = state.channels.find((channel) => channel.id === payload.id);
      currentChannel.name = payload.name;
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels.filter((channel) => channel.id !== payload.id);
    },
  },
});

export const {
  setChannelsData, addNewChannel, setCurrentChannel, renameChannel, removeChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
