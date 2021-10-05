import { createSelector } from 'reselect';

export const selectedChannels = (state) => state.channelsData.channels;

export const selectedCurrentChannelId = (state) => state.channelsData.currentChannelId;

export const selectedLoadingStatus = (state) => state.channelsData.loadingStatus;

export const selectedModalType = (state) => state.modalInfo.modalType;

export const selectedManagedChannel = (state) => state.modalInfo.managedChannel;

export const selectedAuthStatus = (state) => state.loginData.authStatus;

export const selectedAuthData = (state) => state.loginData.authData;

export const selectCurrentChannelMessages = (currentChannelId) => createSelector(
  (state) => state.messagesData.messages,
  (messages) => messages.filter((message) => message.channelId === currentChannelId),
);

export const selectCurrentChannel = (currentChannelId) => createSelector(
  (state) => state.channelsData.channels,
  (channels) => channels.find((channel) => channel.id === currentChannelId),
);

export const selectChannelsNames = createSelector(
  (state) => state.channelsData.channels,
  (channels) => channels.map((c) => c.name),
);
