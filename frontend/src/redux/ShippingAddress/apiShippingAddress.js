import axios from "axios";
import {
  fetchStart, fetchSuccess, fetchFailed,
  addStart, addSuccess, addFailed,
  updateStart, updateSuccess, updateFailed,
  deleteStart, deleteSuccess, deleteFailed,
  setDefaultStart, setDefaultSuccess, setDefaultFailed
} from "./shippingAddressSlice";
import { API_SHIPPING_ADDRESS } from "../../config/api";

export const fetchAddresses = (userId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const res = await axios.get(`${API_SHIPPING_ADDRESS}/${userId}`);
    dispatch(fetchSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(fetchFailed());
  }
};

export const addAddress = (newAddress) => async (dispatch) => {
  try {
    dispatch(addStart());
    const res = await axios.post(`${API_SHIPPING_ADDRESS}`, newAddress);
    dispatch(addSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(addFailed());
  }
};

export const updateAddress = (id, updatedData) => async (dispatch) => {
  try {
    dispatch(updateStart());
    const res = await axios.put(`${API_SHIPPING_ADDRESS}/${id}`, updatedData);
    dispatch(updateSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(updateFailed());
  }
};

export const deleteAddress = (id) => async (dispatch) => {
  try {
    dispatch(deleteStart());
    await axios.delete(`${API_SHIPPING_ADDRESS}/${id}`);
    dispatch(deleteSuccess(id));
  } catch (err) {
    console.log(err);
    dispatch(deleteFailed());
  }
};

export const setDefaultAddress = (addressId, userId) => async (dispatch) => {
  try {
    dispatch(setDefaultStart());
    const res = await axios.patch(`${API_SHIPPING_ADDRESS}/set-default`, { addressId, userId });
    dispatch(setDefaultSuccess(res.data.updated));
  } catch (err) {
    console.log(err);
    dispatch(setDefaultFailed());
  }
};
