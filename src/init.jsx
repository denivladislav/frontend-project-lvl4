import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './store.js';
import ApiContext from './contexts/apiContext.jsx';
import { addNewMessage } from './slices/messagesSlice.js';

import '../assets/application.scss';

const initApi = (socket, store) => {
  const api = {
    sendMessage: (newMessage) => socket.emit('newMessage', newMessage),
  };

  socket.on('newMessage', (newMessage) => {
    store.dispatch(addNewMessage(newMessage));
  });

  return api;
};

export default () => {
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
