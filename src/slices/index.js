import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import modalReducer from './modalSlice.js';
import loginReducer from './loginSlice.js';

export default configureStore({
  reducer: {
    channelsData: channelsReducer,
    messagesData: messagesReducer,
    modalInfo: modalReducer,
    loginData: loginReducer,
  },
});
