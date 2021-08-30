import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
import translationRU from './locales/ru.json';
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

export default async () => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    // debug: false,
    resources: {
      ru: {
        translation: translationRU,
      },
    },
  });
  // eslint-disable-next-line new-cap
  const socket = new io();
  const api = initApi(socket, store);

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ApiContext.Provider value={api}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApiContext.Provider>
    </I18nextProvider>
  );
};
