import { createSlice } from "@reduxjs/toolkit";
import { saveAddresses, loadAddresses } from "../../utils/localStorage";

const initialAddresses = loadAddresses();

const shippingAddressSlice = createSlice({
  name: "shippingAddress",
  initialState: {
    addresses: initialAddresses,
    isFetching: false,
    error: false,
    success: false,
  },
  reducers: {
    fetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    fetchSuccess: (state, action) => {
      state.isFetching = false;
      state.addresses = action.payload;
      state.error = false;
      saveAddresses(state.addresses); // ⚡ lưu luôn
    },
    fetchFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    addStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.success = false;
    },
    addSuccess: (state, action) => {
      state.isFetching = false;
      state.success = true;
      state.addresses.unshift(action.payload);
      saveAddresses(state.addresses); // ⚡ lưu vào localStorage
    },
    addFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    updateStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.success = false;
    },
    updateSuccess: (state, action) => {
      state.isFetching = false;
      state.success = true;
      const updated = action.payload;
      const index = state.addresses.findIndex((addr) => addr._id === updated._id);
      if (index !== -1) state.addresses[index] = updated;
      saveAddresses(state.addresses); // ⚡ lưu vào localStorage
    },
    updateFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    deleteStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.success = false;
    },
    deleteSuccess: (state, action) => {
      state.isFetching = false;
      state.success = true;
      state.addresses = state.addresses.filter((addr) => addr._id !== action.payload);
      saveAddresses(state.addresses); // ⚡ lưu vào localStorage
    },
    deleteFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    setDefaultStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.success = false;
    },
    setDefaultSuccess: (state, action) => {
      state.isFetching = false;
      state.success = true;
      const defaultId = action.payload._id;
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        is_default: addr._id === defaultId
      }));
      saveAddresses(state.addresses); // ⚡ lưu vào localStorage
    },
    setDefaultFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    clearAddresses: (state) => {
      state.addresses = [];
      saveAddresses(state.addresses); // ⚡ xóa localStorage khi logout
    }
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailed,
  addStart, addSuccess, addFailed,
  updateStart, updateSuccess, updateFailed,
  deleteStart, deleteSuccess, deleteFailed,
  setDefaultStart, setDefaultSuccess, setDefaultFailed,
  clearAddresses
} = shippingAddressSlice.actions;

export default shippingAddressSlice.reducer;
