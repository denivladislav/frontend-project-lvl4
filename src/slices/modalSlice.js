import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalType: null,
  managedChannel: null,
};

export const modalSlice = createSlice({
  name: 'modalInfo',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      state.modalType = payload.modalType;
      state.managedChannel = payload.managedChannel;
    },
    closeModal: (state) => {
      state.modalType = null;
      state.managedChannel = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
