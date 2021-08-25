import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './store.js';
import socketContext from './contexts/socketContext.jsx';

import '../assets/application.scss';

export default () => {
  const socket = new io();
  return (
    <socketContext.Provider value={socket}>
      <Provider store={store}>
        <App />
      </Provider>
    </socketContext.Provider>
  );
};
