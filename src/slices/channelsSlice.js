/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchChatData = createAsyncThunk(
  'channelsData/fetchChatContentStatus',
  async ({ header, username }) => {
    const { data } = await axios.get(routes.dataPath(), { headers: header });
    data.username = username;
    return data;
  },
);

const initialState = {
  channels: [],
  currentChannelId: 1,
  username: '',
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.fulfilled, (state, { payload }) => {
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
        state.username = payload.username;
        state.loadingStatus = 'finished';
      })
      .addCase(fetchChatData.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchChatData.rejected, (state) => {
        state.loadingStatus = 'failed';
      });
  },
});

export const {
  setChannelsData, addNewChannel, setCurrentChannel,
  renameChannel, removeChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
