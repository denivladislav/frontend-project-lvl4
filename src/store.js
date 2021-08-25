import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice.js';

export default configureStore({
  reducer: {
    channelsData: channelsReducer,
  },
});
