import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
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
  },
});

export const { setChannelsData, addNewChannel, setCurrentChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
