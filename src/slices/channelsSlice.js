/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchChatData = createAsyncThunk(
  'channelsData/fetchChatContentStatus',
  async ({ header }) => {
    const { data } = await axios.get(routes.dataPath(), { headers: header });
    return data;
  },
);

const initialState = {
  channels: [],
  currentChannelId: 1,
  loadingStatus: 'loading',
};

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState,
  reducers: {
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload.id;
    },
    addNewChannel: (state, { payload }) => {
      state.channels.push(payload);
      state.currentChannelId = payload.id;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.fulfilled, (state, { payload }) => {
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
        state.loadingStatus = 'success';
      })
      .addCase(fetchChatData.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchChatData.rejected, (state) => {
        state.loadingStatus = 'error';
      });
  },
});

export const {
  setChannelsData, addNewChannel, setCurrentChannel,
  renameChannel, removeChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
