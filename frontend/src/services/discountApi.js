import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_BOOK_DISCOUNT } from "../config/api";

// ✅ Lấy tất cả discount
export const getAllDiscount = async () => {
  const res = await axios.get(API_BOOK_DISCOUNT);
  return res.data;
};

// ✅ Tạo discount
export const createDiscount = async (data) => {
  const res = await axios.post(API_BOOK_DISCOUNT, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ✅ Xóa discount
export const deleteDiscount = async (id) => {
  const res = await axios.delete(`${API_BOOK_DISCOUNT}/${id}`, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ✅ Lấy discount theo ID
export const getDiscountById = async (id) => {
  const res = await axios.get(`${API_BOOK_DISCOUNT}/${id}`);
  return res.data;
};

// ✅ Cập nhật discount
export const updateDiscount = async (id, data) => {
  const res = await axios.put(`${API_BOOK_DISCOUNT}/${id}`, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
