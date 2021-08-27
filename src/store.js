import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice.js';
import messagesReducer from './slices/messagesSlice.js';
import modalReducer from './slices/modalSlice.js';

export default configureStore({
  reducer: {
    channelsData: channelsReducer,
    messagesData: messagesReducer,
    modalInfo: modalReducer,
  },
});
