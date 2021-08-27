import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalType: null,
};

export const modalSlice = createSlice({
  name: 'modalInfo',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      state.modalType = payload.modalType;
    },
    closeModal: (state) => {
      state.modalType = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
