import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_BOOK } from "../config/api";
export const getBookById = async (id) => {
  try {
    const res = await axios.get(`${API_BOOK}/${id}`, {
      headers: getAuthHeader(),
    })
    return res.data

  } catch (err) {
    throw new Error(err.response?.data?.message);
  }
}
export const updateBook = async (id, bookData) => {
  try {
    const res = await axios.put(
      `${API_BOOK}/${id}`,
      bookData,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi khi cập nhật sách");
  }
};

export const deleteBook = async (id) => {
  try {
    const res = await axios.delete(`${API_BOOK}/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message);
  }
}
export const getAllBook = async ({ page = 1, limit = 20, search = "", sort = "newest" }) => {
  try {
    const res = await axios.get(`${API_BOOK}/all`, {
      params: { page, limit, search, sort },
    })
    return res.data;

  } catch (err) {
    throw new Error(err.response?.data?.message);
  }

}
export const createBook = async (data) => {
  try {
    const res = await axios.post(`${API_BOOK}`, data, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi khi tạo sách");
  }
};