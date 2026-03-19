import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_AUTHOR } from "../config/api";
export const createAuthor = async (data) => {
  try {
    const res = await axios.post(`${API_AUTHOR}`, data, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message);
  }
};
export const getAuthorById = async (id) => {
  try {
    const res = await axios.get(`${API_AUTHOR}/${id}`, {
      headers: getAuthHeader(),
    })
    return res.data

  } catch (err) {
    throw new Error(err.response?.data?.message);
  }
}
export const updateAuthor = async (id, data) => {
  try {
    const res = await axios.put(`${API_AUTHOR}/${id}`, data, {
      headers: getAuthHeader()
    })
    return res.data;

  } catch (err) {
    throw new Error(err.response?.data?.message);
  }
}
export const deleteAuthor = async (id) => {
  try {
    const res = await axios.delete(`${API_AUTHOR}/${id}`, {
      headers: getAuthHeader(),
    })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message)
  }
}
export const getAllAuthor = async ({ page = 1, limit = 20, search = "", sort = "newest" }) => {
  try {
    const res = await axios.get(`${API_AUTHOR}/all`, {
      params: { page, limit, search, sort },

    });
    return res.data
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tác giả:", err);
    throw err;
  }
};
