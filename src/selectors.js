import { createSelector } from 'reselect';

const selectCurrentChannelMessages = (currentChannelId) => createSelector(
  (state) => state.messagesData.messages,
  (messages) => messages.filter((message) => message.channelId === currentChannelId),
);

const selectCurrentChannel = (currentChannelId) => createSelector(
  (state) => state.channelsData.channels,
  (channels) => channels.find((channel) => channel.id === currentChannelId),
);

const selectChannelsNames = createSelector(
  (state) => state.channelsData.channels,
  (channels) => channels.map((c) => c.name),
);

export { selectCurrentChannelMessages, selectCurrentChannel, selectChannelsNames };
