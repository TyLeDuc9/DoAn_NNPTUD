import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_USER } from "../config/api";

export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const res = await axios.post(`${API_USER}/reset-password/${token}`, { password, confirmPassword });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Có lỗi xảy ra" };
  }
};
export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${API_USER}/forgot-password`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Có lỗi xảy ra" };
  }
};

export const getAllUser = async ({ page = 1, limit = 20, search = "", sort = "newest", role = "" }) => {
  try {
    const res = await axios.get(`${API_USER}/all`, {
      params: { page, limit, search, sort, role },
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      throw new Error("Bạn không có quyền truy cập API này (Admin hoặc Employee mới được xem).");
    }
    throw new Error(err.response?.data?.message || "Lỗi khi lấy danh sách người dùng");
  }
};
export const updateUser = async (id, data) => {
  try {
    const res = await axios.put(`${API_USER}/${id}`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi khi cập nhật người dùng");
  }
};
export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${API_USER}/${id}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi khi xóa người dùng");
  }
};
export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${API_USER}/${id}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi khi lấy thông tin người dùng");
  }
};
