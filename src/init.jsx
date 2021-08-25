import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './store.js';

import '../assets/application.scss';

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
