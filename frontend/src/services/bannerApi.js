import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API_BANNER } from "../config/api";


// 🟢 Lấy toàn bộ banner
export const getBanners = async () => {
  try {
    const res = await axios.get(API_BANNER);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách banner:", err);
  }
};

// 🟢 Lấy banner theo ID
export const getBannerById = async (id) => {
  try {
    const res = await axios.get(`${API_BANNER}/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy banner:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Lỗi khi lấy banner");
  }
};

// 🟢 Tạo banner
export const createBanner = async (data) => {
  try {
    const formData = new FormData();
    if (data.book_name) formData.append("book_name", data.book_name);
    if (data.category_name) formData.append("category_name", data.category_name);
    if (data.image) formData.append("imageUrl", data.image);

    const res = await axios.post(`${API_BANNER}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.log("Lỗi khi tạo banner:", err);
    throw err;
  }
};

// 🟡 Cập nhật banner
export const updateBanner = async (id, data) => {
  try {
    const formData = new FormData();
    if (data.book_name) formData.append("book_name", data.book_name);
    if (data.category_name) formData.append("category_name", data.category_name);
    if (data.image) formData.append("imageUrl", data.image);

    const res = await axios.put(`${API_BANNER}/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Lỗi khi cập nhật banner:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Lỗi khi cập nhật banner");
  }
};

// 🔴 Xóa banner
export const deleteBanner = async (id) => {
  try {
    const res = await axios.delete(`${API_BANNER}/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi khi xóa banner");
  }
};
