import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_BLOG } from "../config/api";

export const getBlogById = async (id) => {
  try {
    const res = await axios.get(`${API_BLOG}/${id}`)
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message)
  }
}
export const updateBlog = async (id, data) => {
  try {
    const res = await axios.put(`${API_BLOG}/${id}`, data, {
      headers: getAuthHeader()
    })
    return res.data

  } catch (err) {
    throw new Error(err.response?.data?.message)
  }
}
export const deleteBlog = async (id) => {
  try {
    const res = await axios.delete(`${API_BLOG}/${id}`, {
      headers: getAuthHeader()
    })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message)
  }
}
export const createBlog = async (data) => {
  try {
    const res = await axios.post(`${API_BLOG}`, data, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message)
  }
}

export const getAllBlog = async () => {
  try {
    const res = await axios.get(API_BLOG);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message);
  }
};

