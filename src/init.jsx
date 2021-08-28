import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './store.js';
import ApiContext from './contexts/apiContext.jsx';
import { addNewMessage } from './slices/messagesSlice.js';
import { addNewChannel, renameChannel, removeChannel } from './slices/channelsSlice.js';

import '../assets/application.scss';

const initApi = (socket, apiStore) => {
  const api = {
    sendMessage: (newMessage) => socket.emit('newMessage', newMessage),
    addChannel: (newChannel) => socket.emit('newChannel', newChannel),
    renameChannel: (id, name) => socket.emit('renameChannel', { id, name }),
    removeChannel: (id) => socket.emit('removeChannel', { id }),
  };

  socket.on('newMessage', (newMessage) => {
    apiStore.dispatch(addNewMessage(newMessage));
  });

  socket.on('newChannel', (newChannel) => {
    apiStore.dispatch(addNewChannel(newChannel));
  });

  socket.on('renameChannel', (id, name) => {
    apiStore.dispatch(renameChannel(id, name));
  });

  socket.on('removeChannel', (id) => {
    apiStore.dispatch(removeChannel(id));
  });

  return api;
};

export default () => {
  // eslint-disable-next-line new-cap
  const socket = new io();
  const api = initApi(socket, store);

  return (
    <ApiContext.Provider value={api}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApiContext.Provider>
  );
};
